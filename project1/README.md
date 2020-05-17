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
- the `Event Bus` service is on port `5005`
