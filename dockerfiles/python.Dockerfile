# Use Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy user code into container
COPY . /app

# Default command to run user code
CMD ["python", "solution.py"]

