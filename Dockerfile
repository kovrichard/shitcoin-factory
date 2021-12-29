FROM trufflesuite/ganache-cli

WORKDIR /usr/src/app/

COPY package.json yarn.lock ./

ENV NODE_PATH=/usr/src/app/node_modules

RUN apk add git && npm i yarn

RUN yarn global add truffle
RUN yarn && rm package.json yarn.lock
