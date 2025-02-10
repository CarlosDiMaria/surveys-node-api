FROM node:18
WORKDIR /usr/src/enquetes-node-api
COPY ./package.json .
RUN npm install --only=prod