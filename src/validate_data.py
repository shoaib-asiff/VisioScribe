import argparse
import os
import sys
import pandas as pd

def validate_data(input_csv: str, output_csv: str):
    print(f"🔍 Starting data validation for: {input_csv}")
    if not os.path.exists(input_csv):
        raise FileNotFoundError(f"Input file not found: {input_csv}")

    df = pd.read_csv(input_csv)
    print(f"📊 Loaded {len(df)} initial rows.")

    required_cols = ["image_url", "caption"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Schema violation: missing required column '{col}'")

    null_count = df[required_cols].isnull().sum().sum()
    if null_count > 0:
        print(f"⚠️ Found {null_count} null entries. Dropping null rows...")
        df = df.dropna(subset=required_cols)

    # Range validation: captions must not be empty and within reasonable length
    df["caption"] = df["caption"].astype(str).str.strip()
    valid_len_mask = (df["caption"].str.len() >= 3) & (df["caption"].str.len() <= 500)
    df = df[valid_len_mask]

    # URL format validation
    valid_url_mask = df["image_url"].str.startswith("http") | df["image_url"].str.startswith("data:image")
    df = df[valid_url_mask]

    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    df.to_csv(output_csv, index=False)
    print(f"✅ Data validation passed successfully. Saved {len(df)} validated samples to {output_csv}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Validate image caption dataset")
    parser.add_argument("--input", default="data/raw/dataset.csv", help="Input dataset CSV path")
    parser.add_argument("--output", default="data/processed/clean_dataset.csv", help="Validated output CSV path")
    args = parser.parse_args()

    try:
        validate_data(args.input, args.output)
    except Exception as exc:
        print(f"❌ Validation failed: {exc}", file=sys.stderr)
        sys.exit(1)
