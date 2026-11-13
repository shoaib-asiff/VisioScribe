"""
VisioScribe - OpenRouter Client Helper
Interacts with OpenRouter free LLMs to generate/enhance captions from image URLs.
"""

import os
import requests
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

OPEN_ROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY", "")
OPEN_ROUTER_MODEL = os.getenv("OPEN_ROUTER_MODEL", "meta-llama/llama-3.2-3b-instruct:free")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def generate_caption_from_url(image_url: str, fallback_caption: str = "") -> str:
    """
    Generate a descriptive caption from an image URL using a free LLM on OpenRouter.
    Falls back gracefully if OpenRouter key is unset or API call fails.
    """
    api_key = os.getenv("OPEN_ROUTER_API_KEY", OPEN_ROUTER_API_KEY).strip()
    model = os.getenv("OPEN_ROUTER_MODEL", OPEN_ROUTER_MODEL).strip()

    if not api_key:
        logger.warning("OPEN_ROUTER_API_KEY not configured. Using fallback caption.")
        return fallback_caption or "a high-resolution photograph of a natural scene"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://dagshub.com/shoaib-asiff/VisioScribe",
        "X-Title": "VisioScribe",
    }

    # Attempt 1: Multimodal Vision Prompt (works with vision-capable free models)
    prompt_messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": (
                        "Provide a concise, accurate, and descriptive caption (one single sentence, under 25 words) "
                        "for this image for an image captioning dataset. Do NOT include prefixes like 'Caption:' or quotes."
                    ),
                },
                {
                    "type": "image_url",
                    "image_url": {"url": image_url},
                },
            ],
        }
    ]

    payload = {
        "model": model,
        "messages": prompt_messages,
        "max_tokens": 100,
        "temperature": 0.4,
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=20)
        if response.status_code == 200:
            result = response.json()
            content = result["choices"][0]["message"]["content"].strip()
            clean_caption = content.replace('"', "").replace("'", "").strip()
            if clean_caption.lower().startswith("caption:"):
                clean_caption = clean_caption[8:].strip()
            logger.info("Successfully generated caption from OpenRouter: %s", clean_caption)
            return clean_caption
        else:
            logger.warning("OpenRouter API returned status %s: %s", response.status_code, response.text)
    except Exception as exc:
        logger.warning("OpenRouter vision request failed: %s", exc)

    # Attempt 2: Text prompt enhancement (if vision request failed or model is text-only)
    if fallback_caption:
        text_payload = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": (
                        f"Refine and enhance this image description into a single polished, descriptive sentence: "
                        f"'{fallback_caption}'. Reply only with the caption text."
                    ),
                }
            ],
            "max_tokens": 60,
        }
        try:
            resp = requests.post(OPENROUTER_URL, headers=headers, json=text_payload, timeout=15)
            if resp.status_code == 200:
                result = resp.json()
                content = result["choices"][0]["message"]["content"].strip()
                return content.replace('"', "").replace("'", "").strip()
        except Exception as exc:
            logger.warning("OpenRouter text enhancement fallback failed: %s", exc)

    return fallback_caption or "a photographic capture of an object in view"
