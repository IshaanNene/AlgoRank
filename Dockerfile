FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1
ENV FORCE_COLOR=1

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    golang \
    default-jdk \
    curl \
    libomp-dev \
    binutils \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup default stable && \
    rustup target add x86_64-unknown-linux-gnu

ENV GOPATH=/go
ENV PATH=$GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin"

ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH=$JAVA_HOME/bin:$PATH

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /AlgoRank/Solutions/{C,CPP,Java,Go,Rust}_Solutions \
    && mkdir -p /AlgoRank/Problem

COPY . /AlgoRank/
WORKDIR /AlgoRank

RUN gcc --version && \
    g++ --version && \
    go version && \
    javac -version && \
    rustc --version

ENTRYPOINT ["python3", "-u", "main.py"]