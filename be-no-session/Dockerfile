# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables (optional)
ENV NODE_ENV=production

# Build the app (if necessary)
RUN npm run build

# Start the app
CMD ["npm", "start"]
