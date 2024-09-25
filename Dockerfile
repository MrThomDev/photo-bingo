# Use the latest LTS version of Node.js on Alpine Linux
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Copy client package.json and install client dependencies
COPY client/package*.json client/
RUN npm run install-client --omit=dev

# Copy server package.json and install server dependencies
COPY server/package*.json server/
RUN npm run install-server --omit-dev

# Copy the client source code and build the client
COPY client/ client/
RUN npm run build --prefix client

# Copy the server source code
##COPY server/ server/
COPY --chown=node:node server/ server/

# Change ownership and set permissions for the directories
RUN chown -R node:node /app/server/src/images /app/server/src/bingo
RUN chmod -R u+rw /app/server/src/images /app/server/src/bingo

# Define volumes for persistent data
VOLUME ["/app/server/src/bingo", "/app/server/src/images"]

# Change to a non-root user for security
USER node

# Define the command to run the server
CMD ["npm", "start", "--prefix", "server"]

# Expose port 8421
EXPOSE 8421
