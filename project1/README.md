## `MICROSERVICES`

A course designed to understand

- the challenges of data exchange in microservices
- best practices with sync and async patterns to communicate between microservices
- implement an Event Bus, and then used common industry tooling to handle communications

## `FOLDER STRUCTURE`

Each project represents a discrete chunk of code, and stages in the learning journey.

#### `Project 1`

This is a made-from-scratch react front end, with multiple backend services (separated out to mimic microserves). The app is meant to simulate a blog/NewsFeed type scenario with Posts and Comments.

- the `Posts` service is on port `5001`
- the `Comments` service is on port `5002`
- the `React` front end app is on port `3000`
- the `Event Bus` service is on port `5005`. Event objects have two
  properties : `type` and `data`.
- the `Query` service is on port `5004`

All services that recieve post requests emit events into the Event Bus. The event bus then emits it out to all subscribing services.
The `Query` service protects against failures of the `Posts` and `Comments` service by receiving all relevant events, and persisting in its own database.

The Front End queries all posts and attached comments from the `Query` service, rather than directly from the `Post` and `Comments` service; however, the actual posting of new comments goes into those services directly. **Thus reads and writes are handled by different services**.
