#!/bin/bash

# Update the system
sudo apt update -y && \

# Install necessary packages
sudo apt install -y git && \

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && \
sudo sh get-docker.sh && \

# Install Docker Compose
DOCKER_COMPOSE_VERSION=1.29.2 && \
sudo curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
sudo chmod +x /usr/local/bin/docker-compose && \

# Verify installation
docker --version && \
docker-compose --version && \

# Clone GitHub Repository
GITHUB_REPO_URL=https://${GithubPersonalAccessToken}@github.com/Rahul-singh98/theBookingBot.git && \
git clone -b microservices $GITHUB_REPO_URL /home/ec2-user/theBookingBot && \

# Switch to the cloned directory and start the application
cd /home/ec2-user/theBookingBot && \
sudo docker-compose up --build
