FROM node:20-alpine
RUN apk add --no-cache docker-cli python3
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD ["node", "server.js"]
