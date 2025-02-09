FROM python:3.9-slim

RUN apt-get update && apt-get install -y gcc make && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash runner

USER runner

WORKDIR /AlgoRank

COPY --chown=runner:runner . /AlgoRank

ENTRYPOINT ["python3", "main.py"]
