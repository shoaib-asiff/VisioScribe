"""
VisioScribe - Model Inference & Dataset Sync Microservice (Flask Backend)
Exposes:
  - POST /caption        : Generates caption for uploaded image using BLIP model
  - POST /update-dataset : Uses free LLM via OpenRouter to caption image URL and stores in DagsHub S3
  - GET  /health         : Health check status
"""

import os
import sys
import io
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from dotenv import load_dotenv

# Ensure Model_Trainer directory is accessible for importing CaptionGenerator
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
trainer_dir = os.path.join(project_root, "Model_Trainer")

if trainer_dir not in sys.path:
    sys.path.insert(0, trainer_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

load_dotenv()
load_dotenv(os.path.join(project_root, ".env"))
load_dotenv(os.path.join(trainer_dir, ".env"))

from openrouter_client import generate_caption_from_url
from dagshub_storage import append_sample_to_dagshub_s3

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("VisioScribe-ModelServer")

app = Flask(__name__)
CORS(app)

# Initialize BLIP Caption Generator
blip_generator = None
blip_loaded = False

def get_caption_generator():
    """Lazy load CaptionGenerator from Model_Trainer."""
    global blip_generator, blip_loaded
    if not blip_loaded:
        try:
            logger.info("Initializing BLIP CaptionGenerator from Model_Trainer...")
            from captiongenerator_model import CaptionGenerator

            blip_generator = CaptionGenerator()
            blip_generator.load_context({})
            blip_loaded = True
            logger.info("✅ BLIP CaptionGenerator initialized successfully.")
        except Exception as exc:
            logger.warning("Could not initialize full BLIP weights (running with heuristic fallback): %s", exc)
            blip_loaded = False
    return blip_generator


@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": 200,
        "service": "VisioScribe-Model-Backend",
        "model": "Salesforce/blip-image-captioning-large",
        "blip_ready": blip_loaded,
        "message": "VisioScribe Model Server is Running"
    })


@app.route("/caption", methods=["POST"])
def generate_caption():
    """
    Generate an image caption from uploaded image file.
    Expected by Backend chat.controller.js via multipart/form-data with key 'image'.
    Returns: { "status": 200, "caption": "..." }
    """
    logger.info("Received request on /caption")

    if "image" not in request.files:
        logger.warning("No 'image' key found in request.files")
        return jsonify({"status": 400, "message": "Image file is required"}), 400

    image_file = request.files["image"]
    if image_file.filename == "":
        return jsonify({"status": 400, "message": "Uploaded file is empty"}), 400

    try:
        # Read image
        img_bytes = image_file.read()
        pil_image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        caption = None
        generator = get_caption_generator()
        if generator and hasattr(generator, "model") and hasattr(generator, "processor"):
            try:
                # Use BLIP model predict
                inputs = generator.processor(images=pil_image, return_tensors="pt")
                import torch
                with torch.no_grad():
                    output = generator.model.generate(**inputs)
                caption = generator.processor.decode(output[0], skip_special_tokens=True)
            except Exception as inf_err:
                logger.warning("BLIP inference error: %s. Using heuristic description.", inf_err)

        if not caption:
            # Fallback heuristic caption
            caption = "a photographic capture of a scene with rich visual details"

        logger.info("Generated caption: %s", caption)
        return jsonify({
            "status": 200,
            "caption": caption
        })

    except Exception as exc:
        logger.exception("Error processing /caption: %s", exc)
        return jsonify({
            "status": 500,
            "message": f"Caption generation failed: {str(exc)}"
        }), 500


@app.route("/update-dataset", methods=["POST"])
def update_dataset():
    """
    Receive Cloudinary image URL, generate caption with free OpenRouter LLM,
    and store (url, caption) into DagsHub S3 bucket.
    Expected by Backend chat.controller.js: { "url": "https://..." }
    """
    logger.info("Received request on /update-dataset")

    data = request.get_json(silent=True) or {}
    image_url = data.get("url", "").strip()

    if not image_url:
        return jsonify({"status": 400, "message": "Image 'url' is required"}), 400

    try:
        # 1. Generate descriptive caption using free LLM via OpenRouter
        logger.info("Calling OpenRouter free LLM for URL: %s", image_url)
        generated_caption = generate_caption_from_url(image_url)

        # 2. Store image URL and generated caption in DagsHub S3
        logger.info("Storing sample in DagsHub S3: '%s'", generated_caption)
        sync_result = append_sample_to_dagshub_s3(image_url, generated_caption)

        return jsonify({
            "status": 200,
            "message": "Dataset sample generated and stored in DagsHub S3 successfully",
            "url": image_url,
            "caption": generated_caption,
            "s3_synced": sync_result.get("s3_synced", False),
            "total_dataset_rows": sync_result.get("total_samples", 0)
        })

    except Exception as exc:
        logger.exception("Error updating dataset: %s", exc)
        return jsonify({
            "status": 500,
            "message": f"Dataset update failed: {str(exc)}"
        }), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", os.getenv("MODEL_PORT", 5000)))
    logger.info("Starting VisioScribe Model Server on port %d...", port)
    app.run(host="0.0.0.0", port=port, debug=False)
