# Use a single-stage build for simplicity
FROM python:3.9-slim

# Install necessary build tools and languages
RUN apt-get update && apt-get install -y \
    gcc g++ make curl wget \
    libomp-dev binutils build-essential \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Install Go
RUN wget https://go.dev/dl/go1.20.5.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.20.5.linux-amd64.tar.gz && \
    rm go1.20.5.linux-amd64.tar.gz
ENV PATH=$PATH:/usr/local/go/bin

# Set up Java environment
ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH=$JAVA_HOME/bin:$PATH

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup default stable && rustup target add x86_64-unknown-linux-gnu

# Create directories for solutions
RUN mkdir -p /AlgoRank/Solutions/{C,Cpp,Java,Go,Rust}_Solutions \
    && mkdir -p /AlgoRank/Problem

WORKDIR /AlgoRank

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Verify uvicorn is installed
RUN which uvicorn && uvicorn --version

# Copy application code
COPY main.py .

# Set Python to run unbuffered
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 8000

# Run the application with uvicorn
CMD ["python", "main.py"]