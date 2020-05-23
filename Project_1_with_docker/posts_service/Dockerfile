# import base image
FROM node:alpine

# working directory for code
WORKDIR /app

# copy and install node modules
COPY ./package.json ./ 
RUN yarn install

# copy all other files
COPY ./ ./

# default command
CMD ["yarn", "start"]