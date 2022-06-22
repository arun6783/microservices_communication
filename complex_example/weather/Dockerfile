FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]
EXPOSE 3000
EXPOSE 3443
EXPOSE 5051