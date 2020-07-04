import { Listener } from "./BaseListener";
import { CHANNEL } from "../publisher";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener {
  subject = CHANNEL;
  qGroupName = "payments-service";
  handleMessage(messageData: any, msg: Message): void {
    // do something
    console.log(
      ` data ${JSON.stringify(messageData, null, 2)} received in subject ${this.subject} for qGroup ${this.qGroupName}`
    );

    msg.ack();
  }
}
