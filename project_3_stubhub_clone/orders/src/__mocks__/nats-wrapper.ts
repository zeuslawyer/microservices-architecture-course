const publishMock = (subject: string, data: string, cb: () => void) => {
  // take type def from stan.publish method
  cb();
};

// import statements for the natsWrapper singleton get re-routed to this object when tests
export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(publishMock)
  }
};
