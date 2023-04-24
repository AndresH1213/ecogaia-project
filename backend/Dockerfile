FROM node:14.17.4-alpine3.14

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node package*.json /usr/src/app/

RUN npm ci --only=production

COPY --chown=node:node . /usr/src/app/

EXPOSE 80

CMD ["npm", "start"]