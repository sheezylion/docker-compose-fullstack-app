# backend/Dockerfile
# Use the official Node.js image
# backend/Dockerfile
FROM node:alpine
WORKDIR /app
COPY server.js .
RUN npm init -y && npm install express
EXPOSE 5000
CMD ["node", "server.js"]
