import nats, { Stan } from "node-nats-streaming";

class Wrapper {
  private _client?: Stan;

  connect(clusterId: string, clientId: string, url: string) {
    // docs call client stan (!?)
    const stan = nats.connect(clusterId, clientId, {
      url
    });
    this._client = stan;

    return new Promise((res, rej) => {
      this._client!.on("connect", () => {
        console.log("NATS Singleton Server Connected");
        return res();
      });

      // error
      this._client!.on("error", (err: any) => {
        rej(err);
      });
    });
  }
}

export const natsWrapper = new Wrapper();
