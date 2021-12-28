FROM trufflesuite/ganache-cli

WORKDIR /usr/src/app/

COPY package*.json ./

ENV NODE_PATH=/usr/src/app/node_modules

RUN npm i -g truffle
RUN npm i && rm package*.json

WORKDIR /usr/src/app/shitcoin-factory
