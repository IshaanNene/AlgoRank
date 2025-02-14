FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1
ENV FORCE_COLOR=1

# Install build essentials and compilers with all required dependencies
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
    cmake \
    pkg-config \
    libssl-dev \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set up Rust
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup default stable
RUN rustup target add x86_64-unknown-linux-gnu

# Set up Go environment
ENV GOPATH=/go
ENV PATH=$GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin"

# Set up Java environment
ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH=$JAVA_HOME/bin:$PATH

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN useradd -m -s /bin/bash runner

# Create necessary directory structure with correct case
RUN mkdir -p /AlgoRank/Solutions/{C,CPP,Java,Go,Rust}_Solutions \
    && mkdir -p /AlgoRank/Problem \
    && chown -R runner:runner /AlgoRank

USER runner

WORKDIR /AlgoRank

COPY --chown=runner:runner . /AlgoRank

# Verify compiler installations and versions
RUN gcc --version && \
    g++ --version && \
    go version && \
    javac -version && \
    rustc --version

ENTRYPOINT ["python3", "-u", "main.py"]
