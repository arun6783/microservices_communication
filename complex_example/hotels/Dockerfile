FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]
EXPOSE 4000
EXPOSE 4443
EXPOSE 5052