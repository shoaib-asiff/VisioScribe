from transformers import BlipProcessor, BlipForConditionalGeneration, BlipConfig
import torch
from PIL import Image
import os

class CaptionGenerator:
    def load_context(self, context):
        self.processor = BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-large')
        config = BlipConfig.from_pretrained('Salesforce/blip-image-captioning-large')
        self.model = BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-large')
