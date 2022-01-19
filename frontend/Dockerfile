FROM node:16-alpine3.15

RUN apk update && apk upgrade
RUN apk add chromium && npm add -g @angular/cli

ENV CHROME_BIN=/usr/bin/chromium-browser

RUN mkdir -p /usr/src/app/
COPY ./ ./usr/src/app/
WORKDIR /usr/src/app/

RUN yarn install && ng update
