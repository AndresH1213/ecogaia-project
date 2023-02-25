FROM node:16

RUN mkdir -p /src/app

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "run", "dev"]