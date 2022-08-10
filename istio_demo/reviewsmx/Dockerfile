FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]

EXPOSE 4500

# grpc port
EXPOSE 4600 