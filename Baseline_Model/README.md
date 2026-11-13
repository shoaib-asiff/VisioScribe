# VisioScribe - Baseline Model Module

This directory encapsulates all baseline model logic and benchmarking tools for VisioScribe.

## Architecture
- **Type**: Heuristic / Frequency-Based Rule Captioner (`BaselineCaptioner`)
- **Evaluation Metric**: Token Overlap BLEU-1 and Reference Cross-Entropy Loss
- **Baseline Performance**:
  - `baseline_bleu`: ~0.22
  - `baseline_loss`: 2.85

## Usage
```bash
# Run baseline evaluation
python3 Baseline_Model/baseline_model.py \
  --data data/processed/clean_dataset.csv \
  --metrics metrics/baseline_metrics.json
```
