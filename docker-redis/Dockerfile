# Use an existing docker image as base
FROM alpine

#  Download + install a dep
RUN apk add --update redis

# Tell Image what to do when it starts as a container
CMD ["redis-server"]