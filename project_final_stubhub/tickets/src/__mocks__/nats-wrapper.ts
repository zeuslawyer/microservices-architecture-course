const publishMock = (subject: string, data: string, cb: () => void) => {
  // take type def from stan.publish method
  cb();
};

export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(publishMock)
  }
};
