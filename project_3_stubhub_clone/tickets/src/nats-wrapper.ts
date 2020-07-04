import nats, { Stan } from "node-nats-streaming";

/**
 * Singleton class that connects to NATS and returns a single instance of the NATS server.
 */
class Wrapper {
  private _client?: Stan; // singleton so only can be accessed from this class

  get client() {
    if (!this._client) throw new Error(" NATS client not instantiated. Is null. Call connect().");
    // else
    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    // docs call client stan (!?)
    const stan = nats.connect(clusterId, clientId, {
      url
    });
    this._client = stan;

    return new Promise((res, rej) => {
      this.client.on("connect", () => {
        console.log("NATS Singleton Server Connected");
        return res();
      });

      // error
      this.client.on("error", (err: any) => {
        rej(err);
      });
    });
  }
}

export const natsWrapper = new Wrapper();
