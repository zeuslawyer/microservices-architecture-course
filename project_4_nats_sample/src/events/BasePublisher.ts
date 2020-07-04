import { SubjectsEnum } from "./Subjects";
import { Message, Stan } from "node-nats-streaming";

interface EventData {
  subject: SubjectsEnum;
  data: any;
}
export abstract class Publisher<T extends EventData> {
  abstract subject: T["subject"];

  private client: Stan;
  protected ackWait = 5 * 1000; // protected so subclasses can access and modify

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]) {
    data = JSON.stringify(data); // stringify for nats

    this.client.publish(this.subject, data, () => {
      console.log(`*** data published in channel ${this.subject}***`);
    });
  }
}
