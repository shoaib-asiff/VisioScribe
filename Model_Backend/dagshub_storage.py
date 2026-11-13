"""
VisioScribe - DagsHub S3 Dataset Storage Helper
Manages downloading, updating, and uploading dataset.csv to DagsHub S3 bucket.
"""

import os
import io
import logging
import pandas as pd
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

DAGSHUB_REPO_OWNER = os.getenv("DAGSHUB_REPO_OWNER", "shoaib-asiff")
DAGSHUB_REPO_NAME = os.getenv("DAGSHUB_REPO_NAME", "VisioScribe")
DAGSHUB_TOKEN = os.getenv("DAGSHUB_TOKEN", "")
DATASET_CSV_PATH = os.getenv("DATASET_CSV_PATH", "dataset.csv")


def append_sample_to_dagshub_s3(image_url: str, caption: str) -> dict:
    """
    Append a new (image_url, caption) row to dataset.csv and sync with DagsHub S3.
    Also saves locally in data/raw/dataset.csv and dataset.csv.
    """
    repo_owner = os.getenv("DAGSHUB_REPO_OWNER", DAGSHUB_REPO_OWNER)
    repo_name = os.getenv("DAGSHUB_REPO_NAME", DAGSHUB_REPO_NAME)
    token = os.getenv("DAGSHUB_TOKEN", DAGSHUB_TOKEN)
    csv_key = os.getenv("DATASET_CSV_PATH", DATASET_CSV_PATH)

    new_row = pd.DataFrame([{"image_url": str(image_url).strip(), "caption": str(caption).strip()}])

    # 1. Determine local file locations
    local_candidates = [
        csv_key,
        os.path.join(os.path.dirname(__file__), "..", "data", "raw", "dataset.csv"),
        os.path.join(os.path.dirname(__file__), "..", "dataset.csv"),
    ]

    df = None
    existing_path = None
    for cand in local_candidates:
        if os.path.exists(cand):
            try:
                df = pd.read_csv(cand)
                existing_path = cand
                break
            except Exception:
                continue

    # 2. Try fetching from DagsHub S3 if configured
    s3_synced = False
    s3_client = None
    try:
        from dagshub import get_repo_bucket_client

        if token:
            os.environ["DAGSHUB_TOKEN"] = token
            s3_client = get_repo_bucket_client(f"{repo_owner}/{repo_name}")
            try:
                buffer = io.BytesIO()
                s3_client.download_fileobj(Bucket=repo_name, Key=csv_key, Fileobj=buffer)
                buffer.seek(0)
                remote_df = pd.read_csv(buffer)
                if remote_df is not None and not remote_df.empty:
                    df = remote_df
                    logger.info("Retrieved current dataset from DagsHub S3 (%d rows)", len(df))
            except Exception as dl_err:
                logger.info("Could not download remote dataset from S3 (using local if present): %s", dl_err)
    except Exception as init_err:
        logger.warning("DagsHub S3 client initialization skipped: %s", init_err)

    # 3. If no existing dataframe, initialize new
    if df is None or df.empty:
        df = pd.DataFrame(columns=["image_url", "caption"])

    # Ensure correct columns
    if "image_url" not in df.columns:
        if "image" in df.columns:
            df["image_url"] = df["image"]
        else:
            df["image_url"] = ""

    # Append new sample
    updated_df = pd.concat([df, new_row], ignore_index=True)
    logger.info("Dataset updated. New count: %d rows", len(updated_df))

    # 4. Save to local paths
    saved_paths = []
    for target in local_candidates:
        try:
            os.makedirs(os.path.dirname(os.path.abspath(target)), exist_ok=True)
            updated_df.to_csv(target, index=False)
            saved_paths.append(target)
        except Exception as write_err:
            logger.warning("Could not write local CSV to %s: %s", target, write_err)

    # 5. Upload back to DagsHub S3
    if s3_client is not None:
        try:
            out_buffer = io.BytesIO()
            updated_df.to_csv(out_buffer, index=False)
            out_buffer.seek(0)
            s3_client.upload_fileobj(out_buffer, Bucket=repo_name, Key=csv_key)
            s3_synced = True
            logger.info("✅ Uploaded updated dataset.csv to DagsHub S3 bucket '%s'", repo_name)
        except Exception as upload_err:
            logger.warning("⚠️ Failed uploading to DagsHub S3: %s", upload_err)

    return {
        "status": 200,
        "s3_synced": s3_synced,
        "total_samples": len(updated_df),
        "saved_paths": saved_paths,
        "sample": {"image_url": image_url, "caption": caption},
    }
