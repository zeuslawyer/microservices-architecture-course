# specify base image and specific version
FROM node:10.20.1-alpine

# set working directory
WORKDIR /usr/app

# copy deps and install deps
COPY ./package.json ./
RUN yarn install

#  copy the code files
COPY ./ ./


#  setup default command
CMD ["yarn", "start"] 