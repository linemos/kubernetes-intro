# Dockerfile
FROM node:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY ./package.json /app
COPY server.js /app
RUN npm install

# Bundle app source
COPY src/. /app/src
COPY public/. /app/public

# Build and optimize react app
RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "production" ]
