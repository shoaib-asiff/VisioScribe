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

# Training hyperparameters
BATCH_SIZE = int(os.getenv("BATCH_SIZE", 2))
NUM_EPOCHS = int(os.getenv("NUM_EPOCHS", 1))
LEARNING_RATE = float(os.getenv("LEARNING_RATE", 1e-5))
WEIGHT_DECAY = float(os.getenv("WEIGHT_DECAY", 1e-4))
NUM_WORKERS = int(os.getenv("NUM_WORKERS", 0))
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

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
        import base64

        try:
            if image_ref.startswith("data:image"):
                _, data = image_ref.split(",", 1)
                img_bytes = base64.b64decode(data)
                return Image.open(io.BytesIO(img_bytes)).convert("RGB")

            if image_ref.startswith("http"):
                resp = requests.get(image_ref, timeout=15)
                resp.raise_for_status()
                return Image.open(io.BytesIO(resp.content)).convert("RGB")

            if os.path.exists(image_ref):
                return Image.open(image_ref).convert("RGB")

            raise ValueError(f"Unsupported image reference: {image_ref}")
        except Exception as exc:  # noqa: BLE001
            logger.warning("Falling back to blank image for %s (%s)", image_ref, exc)
            return Image.new("RGB", (224, 224), color="black")

    def __getitem__(self, idx: int) -> Tuple[Image.Image, str]:
        row = self.dataframe.iloc[idx]
        image_col = "image" if "image" in row else "image_url"
        return self._load_image(str(row[image_col])), str(row["caption"])


def build_dataloader(dataframe: pd.DataFrame) -> DataLoader:
    dataset = CaptionDataset(dataframe)
    if len(dataset) == 0:
        raise ValueError("Dataset is empty; cannot build dataloader.")

    return DataLoader(
        dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=NUM_WORKERS,
        collate_fn=lambda batch: list(zip(*batch)),  # returns (images, captions)
    )


# MLflow utilities
def configure_mlflow() -> None:
    if DAGSHUB_TOKEN and DAGSHUB_REPO_OWNER:
        os.environ["MLFLOW_TRACKING_USERNAME"] = DAGSHUB_REPO_OWNER
        os.environ["MLFLOW_TRACKING_PASSWORD"] = DAGSHUB_TOKEN

    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow.set_experiment(MLFLOW_EXPERIMENT_NAME)
    logger.info("MLflow configured. Tracking URI: %s", MLFLOW_TRACKING_URI)


# Training & registration
def train_model(
    dataloader: DataLoader,
    model_name: str = os.getenv("MODEL_NAME", "VisioScribe-Caption-Model"),
    version: str = "1.0",
) -> Dict[str, str]:
    configure_mlflow()

    caption_gen = CaptionGenerator()
    caption_gen.load_context({})
    caption_gen.model.to(DEVICE)

    optimizer = torch.optim.AdamW(caption_gen.model.parameters(), lr=LEARNING_RATE, weight_decay=WEIGHT_DECAY)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=max(NUM_EPOCHS, 1))

    with mlflow.start_run(run_name=MLFLOW_RUN_NAME) as run:
        mlflow.log_params(
            {
                "batch_size": BATCH_SIZE,
                "epochs": NUM_EPOCHS,
                "learning_rate": LEARNING_RATE,
                "weight_decay": WEIGHT_DECAY,
                "device": str(DEVICE),
                "model_name": model_name,
                "version": version,
                "dataset_size": len(dataloader.dataset),  # type: ignore[arg-type]
            }
        )

        for epoch in range(NUM_EPOCHS):
            caption_gen.model.train()
            running_loss = 0.0

            for step, (images, captions) in enumerate(dataloader):
                optimizer.zero_grad()

                inputs = caption_gen.processor(images=list(images), text=list(captions), return_tensors="pt", padding=True)
                inputs["labels"] = inputs["input_ids"]
                inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

                outputs = caption_gen.model(**inputs)
                loss = outputs.loss
                loss.backward()
                torch.nn.utils.clip_grad_norm_(caption_gen.model.parameters(), max_norm=1.0)
                optimizer.step()

                running_loss += loss.item()
                if (step + 1) % 5 == 0:
                    mlflow.log_metric("batch_loss", running_loss / (step + 1), step=epoch * len(dataloader) + step)

            epoch_loss = running_loss / max(len(dataloader), 1)
            mlflow.log_metric("epoch_loss", epoch_loss, step=epoch)
            scheduler.step()
            logger.info("Epoch %d/%d - loss: %.4f", epoch + 1, NUM_EPOCHS, epoch_loss)

        # Persist model locally then log to MLflow
        artifact_path = "caption_model"
        os.makedirs(artifact_path, exist_ok=True)
        model_file = os.path.join(artifact_path, "model.pt")
        torch.save(caption_gen.model.state_dict(), model_file)

        mlflow.log_artifact(model_file, artifact_path="caption_model")

        logger.info("Training complete. Run ID: %s", run.info.run_id)
        return {"run_id": run.info.run_id, "model_name": model_name}


def register_model_on_mlflow(run_id: str, model_name: str, artifact_uri: str, stage: str = "Production") -> Dict[str, str]:
    client = mlflow.tracking.MlflowClient()
    
    model_version = client.create_model_version(
        name=model_name,
        source=artifact_uri, 
        run_id=run_id
    )
    
    client.transition_model_version_stage(
        name=model_name,
        version=model_version.version,
        stage=stage
    )

    logger.info("Model registered: %s (v%s) -> %s", model_name, model_version.version, stage)

    if os.path.exists(DATASET_CSV_PATH):
        os.remove(DATASET_CSV_PATH)

    return {"model_name": model_name, "version": model_version.version, "stage": stage, "run_id": run_id}


