FROM trufflesuite/ganache-cli

WORKDIR /usr/src/app/

COPY package.json yarn.lock ./

ENV NODE_PATH=/usr/src/app/node_modules

RUN apk add git python3 make gcc g++ musl-dev && npm i yarn && ln -sf python3 /usr/bin/python

RUN yarn global add truffle ganache
RUN yarn && rm package.json yarn.lock
