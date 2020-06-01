# `MICROSERVICES`

A course designed to understand:

- the challenges of data exchange in microservices
- best practices with sync and async patterns to communicate between microservices
- implement an Event Bus, and then used common industry tooling to handle communications

## `TECHNOLOGY STACK`

- JavaScript & TypeScript
- ReactJs / NextJs (server-side rendering)
- NodeJs, Express, MongoDb
- Redis
- Docker, Kubernetes, Skaffold
- Google Cloud Platform (nitrous developments account) - Kubernetes, Google Cloud Build, Google Cloud VM,
- custom NPM module/library called `common`
- NATS streaming event-bus

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

#### `Project 2`

Containerizes `Project 1`. Adds kubernetes and ends with adding Skaffold as a dev tool.

#### `Project 3`

Build a [stubhub.com](stubhub.com) clone using microservices and event-driven architecture

##### `App Overview`

![App Overview](./img/stubhub-overview.png)

##### `App Design`

![App Overview](./img/stubhub-design.png)

##### `App Objects(Resources)`

![App Events](./img/stubhub-resources.png)

##### `App Events`

![App Events](./img/stubhub-events.png)

##### `App Services`

![App Services](./img/stubhub-services.png)

##### `Key Steps - using the Auth Service as an example`

To set up Docker and Kube for a given (auth, by example) service follow these steps:

**Docker**

1. You need a Docker image for the service. So create a `Dockerfile` in the root of the service folder
2. Create the `dockerignore` and ignore `node_modules` and others
3. run `docker build zeuslawyer/<image name> .`
4. Check that you have the `ingress-nginx` controller for network i/o running on docker. you can run `docker ps --all` to check if its running. Otherwise install it from `kubernetes.github.io/ingress-nginx`

**Kubernetes**

1. Create a Kube Deployment (which creates a set of pods that runs the auth service.)
2. create an `infra/k8s` path inside the project `root folder` and inside there create the config file `auth-depl.yaml`
3. In the project `root folder` create the `skaffold.yaml` configuration file to use Skaffold devtools. Point it to the necessary deployments that skaffold must monitor and manage.
4. run `skaffold dev` from the project `root folder` and check terminal outputs.
5. Consider the two ways to allow an outside network request (from browser) to get inside the Kube pod and hit the service. The two ways to do this are using a Kube NodePort service object or a service like the `ingress-nginx`. If the `ingress-nginx` instance is still running in docker, then create a new `ingress-nginx-srv.yaml` file
6. In this file if you're changing the host, then update `/etc/hosts` on the machine to enable redirects to that host domain that you've chosen.
7. Upon navigation there will be a security error in chrome because `ingress-nginx` expects https by default. Get around this by typing anywhere in browser `thisisunsafe`

**Google Kubernetes Engine**

1. CReate a new project in console.cloud.google.com and create a new GKE instance, an associate it with region closest. choose the lowest configurations and from Node Pool choose a share GPU low end machine.
2. Login via terminal using gcloud, and choose the right account using `gcloud auth login`. ensure the region is set to match the one chosen on cloud.console.
3. Strategy is to retain use of Docker Desktop, while spinning up cluster in GCP. So set the context (folder context) for the cluster in GKE by using `gcloud container clusters get-credentials <Project Name (NOT id)>`. You can get the project Id by listing out the configurations using `gcloud config configurations list`
4. verify that the cluster contexct has been set on GKE by clicking the docker desktop taskbar icon, clicking Kubernetes and checking whether a GKE context is there.
5. Enable Google cloud build to build images using the Dockerfile in codebase
6. update the `skaffold.yaml` file to configure it with Google Cloud Build / gcloud
7. configure ingress-nginx in the GKE cluster
8. update `/etc/hosts` to point to GKE cluster
9. restart skaffold
