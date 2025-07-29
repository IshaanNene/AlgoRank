FROM python:3.11-slim-buster

# Use multi-stage build for smaller image
WORKDIR /app

# Install only required packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only necessary files
COPY test_runner.py .
COPY starter_code.py .
COPY testcases.json .

# Enable Python optimization
ENV PYTHONOPTIMIZE=2
ENV PYTHONUNBUFFERED=1

CMD ["python", "-OO", "test_runner.py"]