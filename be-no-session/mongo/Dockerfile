# Use the official MongoDB image
FROM mongo:6.0

# Set default MongoDB data path
VOLUME /data/db

# Expose MongoDB port
EXPOSE 27017

# Copy initialization script (optional)
COPY init-mongo.js /docker-entrypoint-initdb.d/
