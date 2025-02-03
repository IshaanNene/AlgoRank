FROM python:3.9-slim

RUN apt-get update && apt-get install -y gcc make

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

ENTRYPOINT ["python3", "main.py"]
