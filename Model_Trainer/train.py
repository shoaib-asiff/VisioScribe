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
