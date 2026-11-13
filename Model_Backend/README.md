# VisioScribe - Model Backend (Flask Microservice)

Dedicated Flask microservice providing real-time BLIP image captioning and automated DagsHub S3 dataset enrichment via OpenRouter free LLM.

## Features
- **`/caption` (`POST`)**: Receives an uploaded image (`multipart/form-data`) from Express `chat.controller.js`, processes it through the BLIP Vision-Language model, and returns `{ "status": 200, "caption": "..." }`.
- **`/update-dataset` (`POST`)**: Receives `{ "url": "https://..." }`, queries OpenRouter with a free LLM to generate high-quality dataset descriptions, and saves the sample to `dataset.csv` in DagsHub S3 bucket.
- **`/health` (`GET`)**: Microservice health check.

## Running the Server
```bash
# Activate virtual environment
source venv/bin/activate

# Run the Flask model server
cd Model_Backend
python3 app.py
```
> Server will start listening on `http://0.0.0.0:5000`.
