FROM python:slim

RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY same.c .
COPY main.py .
COPY problem.json .

CMD ["python3", "main.py"]
