export const natsWrapper = {
  client: {
    publish: (subject: string, data: string, cb: () => void) => {
      // take type def from stan.publish method
      cb();
    }
  }
};
