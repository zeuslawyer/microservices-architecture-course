# specify base image and specific version
FROM node:10.20.1-alpine

# copy files from local context into the container
COPY ./ ./

# install deps from the package.json
RUN yarn install

#  setup default command
CMD ["yarn", "start"] 