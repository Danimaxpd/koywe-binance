# Use the official Node.js image as base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Fastify app is listening on
EXPOSE ${PORT:-3000}

# Start the Fastify app
CMD [ "sh", "-c", "npm run dev:start" ]
