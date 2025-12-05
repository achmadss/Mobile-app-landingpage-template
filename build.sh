#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker compose build

# Create a temporary container to copy files from
echo "Creating container..."
docker compose up -d

# Wait a moment for container to be ready
sleep 2

# Copy the built files from container to host
echo "Copying built files to ./_site..."
rm -rf ./_site
docker cp info-krl-builder:/app/_site ./_site

# Stop and remove the container
echo "Cleaning up..."
docker compose down

echo "Done! Built files are in ./_site/"
