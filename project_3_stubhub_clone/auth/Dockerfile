FROM node:13.14.0-alpine3.10

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

CMD ["yarn", "start"]