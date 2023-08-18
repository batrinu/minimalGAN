# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY backend/requirements.txt ./
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# Copy package.json and package-lock.json
COPY frontend/package*.json ./
RUN npm ci

# Copy the frontend and backend source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Make ports 3000 and 5000 available to the world outside this container
EXPOSE 3000
EXPOSE 5000

# Define environment variable
ENV NAME minimal-music-generator

# Run the frontend and backend when the container launches
CMD ["sh", "-c", "cd frontend && npm run start & python3 backend/app.py"]
