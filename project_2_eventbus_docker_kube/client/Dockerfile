# import base image
FROM node:alpine

# workaround for create-react-app bug re docker  https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19438444#questions
ENV CI=true

# working directory for code
WORKDIR /app

# copy and install node modules
COPY package.json ./ 
RUN yarn install

# copy all other files
COPY ./ ./

# default command
CMD ["yarn", "start"]