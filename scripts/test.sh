#!/bin/bash

# Run backend tests
echo "Running backend tests..."
cd BackEnd
go test ./... -v

# Run frontend tests
echo "Running frontend tests..."
cd ../FrontEnd
npm test

# Run integration tests
echo "Running integration tests..."
cd ../tests
python -m pytest integration_tests/ 