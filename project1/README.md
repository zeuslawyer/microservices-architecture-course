# `MICROSERVICES`

A course designed to understand:

- the challenges of data exchange in microservices
- best practices with sync and async patterns to communicate between microservices
- implement an Event Bus, and then used common industry tooling to handle communications

## `FOLDER STRUCTURE`

Each project represents a discrete chunk of code, and stages in the learning journey.

Each stage of the course is also reflected in a branch, whose name should correlate with the folder associated with each stage in the course.

#### `Project 1`

This is a made-from-scratch react front end, with multiple backend services (separated out to mimic microservices). The app is meant to simulate a blog/NewsFeed type scenario with Posts and Comments. It is **extremely** basic and crude, and only intended to illustrate the challenges in true production-grade challenges presented by microservices.

- the `React` front end app is on port `3000`
- the `Posts` service is on port `5001`. It receives posts and it emits events into the event bus. It also receives events from the event bus.
- the `Comments` service is on port `5002`. It receives comments and emits `CommentCreated` events into the event bus. It also receives events from the event bus. Comments are sent to the `Moderator` service, which moderates it and emits it back with `status` to `CommentModerated`. Then the `Comments` service updates its database, and emits with `CommentUpdated` through the event bus, to be picked up by the `Query` Service.
- the `Query` service is on port `5004`. It fetches data for the Front End. It joins `Posts` and `Comments` and returns them. It receives events from the event bus.
- the `Comment Moderator` service is on port `5003`. It receives events from the event bus. It moderates the `status` flag on `Comments` and emits an event that notifies subscribers that comments have been updated. The `Query` service listens for this update to update the presentation layer with updated comment data.
- the `Event Bus` service is on port `5005`. Event objects havfe two properties : `type` and `data`. The event data also publishes events to the other 3 services.

All services that recieve post requests emit events into the Event Bus. The event bus then emits it out to all subscribing services.
The `Query` service protects against failures of the `Posts` and `Comments` service by receiving all relevant events, and persisting in its own database.

The Front End queries all posts and attached comments from the `Query` service, rather than directly from the `Post` and `Comments` service; however, the actual posting of new comments goes into those services directly. **Thus reads and writes are handled by different services**.

## `Docker CLI commands`

This section pertains to the folder `docker-redis`.

#### `Container and Image management`

- **list** all containers `docker container ls -a` or `docker ps --all`f. List all _running_ containers: `docker ps`
- **stop** running a single container with `docker stop <container id>` and stop running multiple containers with `docker container stop 75835a67d134 2a4cca5ac898` command followed by a list of all containers IDs. `docker container stop $(docker container ls -aq)` will stop _all_ running containers. **kill** with `docker container kill`. `stop` sends a `SIGTERM` and gives process time to wrap up. `kill` sends a `SIGKILL`.
- **remove** one or more containers by id with `docker container rm b4fade9f1784 <id2>`. Remove all stopped containers, all dangling images, and all unused networks `docker system prune`, and this is important to free up space taken up by stopped containers.
- **list** all images `docker images` or `docker image ls`
- **remove** images by reference to their ID `docker image rm 75835a67d134 2a4cca5ac898`

#### `running Docker images`

Note: `docker run` = `docker create` + `docker start`, from a given image.

- to run a locally available image (or download an image from Docker Hub and then run it locally) use `docker run <image name> < [override command] >`. The optional override command overrides the default command for the container.
- to see the output of a container (without re-starting it) run `docker logs <container id>`. This is useful for inspecting, debuging and reviewing whats going on in containers.

#### `creating docker images`

An image requires that a `Dockerfile` first be generated, and that defines the basic config/setup needed for our containerized app.

- from inside the folder which has the `Dockerfile` image, run `docker build .` After building the terminal will show `Succesfully built <<some image id>>`. Copy that id and do `docker run <<image id>>`.
- to build with a name (aka tag) for the image, run `docker build -t zeuslawyer/<< project-name >>:latest .` With that we can generate the container with `docker run zeuslawyer/<< project-name >>`
- the `Dockerfile` will have some basics commands like `FROM`, `RUN` and `CMD`. `FROM` indicates which docker "base image" to use. `RUN` issues the command we want to run while creating the docker image. `CMD` specifies what should be executed when the image is used to spawn a container.

#### `container terminal/shell access`

- execute another command that is provided as input into the container `docker exec -it <<container id>> << command >>`
- **but** its better to open up a shell tunnel into the container's process. For that use `docker exec -it <<container id>> sh`. That will give us a `#` sign as a shell prompt
- you can also startup a container from an image, and immediate tunnel into a shell process within it _without_ interacting with the underlying program. Do this with `docker run -it <<image name>> sh`.
- exit with `ctrl d` or `ctrl c`
