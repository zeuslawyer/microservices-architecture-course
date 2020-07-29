FROM node:13.14.0-alpine3.10

WORKDIR /app

COPY package.json .

# exclude dev dependencies
RUN yarn install --production=true 

COPY . .

CMD ["yarn", "start"]