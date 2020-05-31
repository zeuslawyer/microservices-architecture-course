## `DOCKER`

This section pertains to the folder `docker-redis`.

#### `Container and Image management`

- **list** all containers `docker container ls -a` or `docker ps --all`f. List all _running_ containers: `docker ps`
- **stop** running a single container with `docker stop <container id>` and stop running multiple containers with `docker container stop 75835a67d134 2a4cca5ac898` command followed by a list of all containers IDs. `docker container stop $(docker container ls -aq)` will stop _all_ running containers. **kill** with `docker container kill`. `stop` sends a `SIGTERM` and gives process time to wrap up. `kill` sends a `SIGKILL`.
- **remove** one or more containers by id with `docker container rm b4fade9f1784 <id2>`. Remove all stopped containers, all dangling images, and all unused networks `docker system prune`, and this is important to free up space taken up by stopped containers.
- **list** all images `docker images` or `docker image ls`
- **remove** images by reference to their ID `docker image rm 75835a67d134 2a4cca5ac898`

#### `running Docker containers (docker run)`

Note: `docker run` = `docker create` + `docker start`, from a given image. `docker create` creates the image, and `docker start` executes the default or other command.

- to run a locally available image (or download an image from Docker Hub and then run it locally) use `docker run <image name> < [override command] >`. The optional override command overrides the default command for the container.
- to see the output of a container (without re-starting it) run `docker logs <container id>`. This is useful for inspecting, debuging and reviewing whats going on in containers.
- to map system ports into ports inside the container (needed for incoming requests only), use `docker run -it -p [local host port] : [port in container] <image id>`. The `-it` helps with terminal access [see this section](#container-terminal-shell-access) into the container, so that a `ctrl+c` stops the server.

#### `Dockerfile - building docker images (docker build)`

An image requires that a `Dockerfile` first be generated, and that defines the basic config/setup needed for our containerized app. Each step inside a Dockerfile is cached, and so changes trigger a re-run of _all_ steps that come on and after the changed one, but not preceding steps.

- from inside the folder which has the `Dockerfile` image, run `docker build .` After building the terminal will show `Succesfully built <<some image id>>`. Copy that id and do `docker run <<image id>>`.
- to build with a name (aka tag) for the image, run `docker build -t zeuslawyer/<< project-name >>:latest .` With that we can generate the container with `docker run zeuslawyer/<< project-name >> .`. Don't forget the `.` at the end!
- the `Dockerfile` will have some basics commands like `FROM`, `RUN` and `CMD`. `FROM` indicates which docker "base image" . and version to use - e.g. `FROM node:10.20.1-jessie-slim` . `RUN` issues the command we want to run while creating the docker image. `CMD` specifies what should be executed when the image is used to spawn a container - e.g. `CMD ["npm", "start"]`.
- to use an existing container, modify its filesystem and contents, and then generate an image out of that (usually its image -> container, but this is container -> modify -> image) we run the following: `docker commit -c 'CMD["<< override command that usually goes into Dockerfile >>"]' << container id >>`. So that is something like `docker commit -c 'CMD["redis-server"]' f70734b6a266`. That generates a new image, which you can then run with `docker run <...>`.
- set the working directory inside the container relateive to its current position by adding `WORKDIR /usr/app`. This directory will be visible when you do a `ls` from inside a container's shell ([shell access](#container-terminal-shell-access)). When you access the container via the shell it will go directly to the WORKDIR.
- when creating the docker file you may need to specify that certain files from the local filesystem need to be copied over to the image. For that use `COPY <source path - relative to Dockerfile> <WORKDIRr>`. This is often broken into two steps - first copying the `package.json` and then copying the main code. This is so that changes to the code dont trigger a rebuild and reinstall of all the dependencies, as the cache tracks what has changed. so two separate copy commands separates the cache and it only rebuilds stuff that is changed. This often looks like

  ```Dockerfile
  COPY ./package.json ./
  RUN yarn install

  COPY ./ ./
  ```

- ignore files and filders from copy with a `.dockerignore` file.

#### `container terminal shell access`

- execute another command that is provided as input into the container `docker exec -it <<container id>> << command >>`. This attaches another process to a container _that is already running_. Useful for adding shell access to it.
- **but** its better to open up a shell tunnel into the container's process. For that use `docker exec -it <<container id>> sh`. That will give us a `#` sign as a shell prompt
- you can also startup a container from an image, and immediate tunnel into a shell process within it _without_ interacting with the underlying program. Do this with `docker run -it <<image name>> sh`. The `sh` at the end is what produces the command prompt inside.
- exit shell with `ctrl d` or `exit`
