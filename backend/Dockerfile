FROM node:16

RUN mkdir -p /src/app

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80
EXPOSE 3000

CMD ["npm", "start"]