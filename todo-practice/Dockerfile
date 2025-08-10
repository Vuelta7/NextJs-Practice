# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the app
RUN npm run build

# Expose port (Next.js default is 3000)
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
