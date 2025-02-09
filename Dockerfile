FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1
ENV FORCE_COLOR=1

RUN apt-get update && apt-get install -y gcc make && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN useradd -m -s /bin/bash runner

USER runner

WORKDIR /AlgoRank

COPY --chown=runner:runner . /AlgoRank

ENTRYPOINT ["python3", "-u", "main.py"]
