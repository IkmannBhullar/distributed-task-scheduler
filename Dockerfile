# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# We don't specify a CMD here because we will use docker-compose
# to decide whether to run the 'producer' or 'worker' script.