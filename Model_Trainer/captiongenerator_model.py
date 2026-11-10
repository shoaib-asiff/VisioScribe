from transformers import BlipProcessor, BlipForConditionalGeneration, BlipConfig
import torch
from PIL import Image
import os

class CaptionGenerator:
    def load_context(self, context):
        self.processor = BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-large')
        config = BlipConfig.from_pretrained('Salesforce/blip-image-captioning-large')
        self.model = BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-large')

    def predict(self, context, image):
        image = Image.open(image).convert('RGB')
        inputs = self.processor(images=image, return_tensors='pt')
        with torch.no_grad():
            output = self.model.generate(**inputs)
        caption = self.processor.decode(output[0], skip_special_tokens=True)
        return caption
