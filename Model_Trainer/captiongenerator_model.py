from transformers import BlipProcessor, BlipForConditionalGeneration, BlipConfig
import torch
from PIL import Image
import os
import mlflow
from mlflow.tracking import MlflowClient

class CaptionGenerator:
    def load_context(self, context):
        self.processor = BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-large')
        config = BlipConfig.from_pretrained('Salesforce/blip-image-captioning-large')

        custom_weights_loaded = False
        try:
            print("🔍 Checking MLflow for custom model...")
            mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "https://dagshub.com/shoaib-asiff/VisioScribe.mlflow"))
            client = MlflowClient()
            latest = client.get_latest_versions(os.getenv("MODEL_NAME", "VisioScribe-Caption-Model"), stages=["Production"])
            if latest:
                run_id = latest[0].run_id
                print(f"⬇ Downloading custom model from Run ID: {run_id}...")
                local_path = mlflow.artifacts.download_artifacts(run_id=run_id, artifact_path="caption_model/model.pt")
                self.model = BlipForConditionalGeneration(config)
                state_dict = torch.load(local_path, map_location='cpu')
                self.model.load_state_dict(state_dict)
                custom_weights_loaded = True
                print("✅ Custom model loaded successfully!")
        except Exception as e:
            print(f"⚠ Could not load custom model: {e}")

        if not custom_weights_loaded:
            print("🔄 Fallback: Loading default Salesforce weights...")
            self.model = BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-large')

    def predict(self, context, image):
        image = Image.open(image).convert('RGB')
        inputs = self.processor(images=image, return_tensors='pt')
        with torch.no_grad():
            output = self.model.generate(**inputs)
        caption = self.processor.decode(output[0], skip_special_tokens=True)
        return caption
