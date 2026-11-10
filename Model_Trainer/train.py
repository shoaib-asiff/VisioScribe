from __future__ import annotations

import io
import os
import logging
from typing import Dict, Tuple

import pandas as pd
import requests
import torch
from dotenv import load_dotenv
from PIL import Image
from torch.utils.data import DataLoader, Dataset

import mlflow
import mlflow.pytorch
from captiongenerator_model import CaptionGenerator
from dagshub import get_repo_bucket_client
from botocore.exceptions import ClientError

# Environment & logging
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# DagsHub / MLflow configuration
DAGSHUB_REPO_OWNER = os.getenv("DAGSHUB_REPO_OWNER", "shoaib-asiff")
DAGSHUB_REPO_NAME = os.getenv("DAGSHUB_REPO_NAME", "VisioScribe")
DAGSHUB_TOKEN = os.getenv("DAGSHUB_TOKEN", "")
DATASET_CSV_PATH = os.getenv("DATASET_CSV_PATH", "dataset.csv")

MLFLOW_TRACKING_URI = os.getenv("MLFLOW_TRACKING_URI", "https://dagshub.com/shoaib-asiff/VisioScribe.mlflow")
MLFLOW_EXPERIMENT_NAME = os.getenv("MLFLOW_EXPERIMENT_NAME", "visioscribe-training")
MLFLOW_RUN_NAME = os.getenv("MLFLOW_RUN_NAME", "visioscribe-blip-run")

# Data utilities
def _auth_headers() -> Dict[str, str]:
    if not DAGSHUB_TOKEN:
        return {}
    return {"Authorization": f"token {DAGSHUB_TOKEN}"}

def fetch_dataset_from_dagshub() -> pd.DataFrame:
    s3_client = get_repo_bucket_client(f"{DAGSHUB_REPO_OWNER}/{DAGSHUB_REPO_NAME}")
    try:
        s3_client.download_file(
            Bucket=DAGSHUB_REPO_NAME,
            Key=DATASET_CSV_PATH,
            Filename=DATASET_CSV_PATH
        )
    except ClientError as c:
        print(f"Failed to Fetch DataSets: {c}")
        return

    if not os.path.exists(DATASET_CSV_PATH):
        raise RuntimeError(f"Failed to fetch CSV from DagsHub")

    dataframe = pd.read_csv(DATASET_CSV_PATH)

    if "image_url" not in dataframe.columns or "caption" not in dataframe.columns:
        raise ValueError("CSV must contain 'image' (or 'image_url') and 'caption' columns.")

    # Drop rows with missing values
    dataframe = dataframe.dropna(subset=["image_url", "caption"]).reset_index(drop=True)
    logger.info("Loaded %d samples from DagsHub CSV", len(dataframe))
    return dataframe

class CaptionDataset(Dataset):

    def __init__(self, dataframe: pd.DataFrame):
        self.dataframe = dataframe.reset_index(drop=True)

    def __len__(self) -> int:
        return len(self.dataframe)

    def _load_image(self, image_ref: str) -> Image.Image:
        try:
            if image_ref.startswith("http"):
                resp = requests.get(image_ref, timeout=15)
                resp.raise_for_status()
                return Image.open(io.BytesIO(resp.content)).convert("RGB")
            raise ValueError(f"Unsupported image reference: {image_ref}")
        except Exception as exc:
            logger.warning("Falling back to blank image for %s (%s)", image_ref, exc)
            return Image.new("RGB", (224, 224), color="black")
