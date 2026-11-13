FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt --timeout 120

COPY . .

EXPOSE 5000

CMD [ "python", "train.py" ]