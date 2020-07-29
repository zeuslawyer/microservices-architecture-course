import { Listener } from "./BaseListener";
import { Message } from "node-nats-streaming";
import { SubjectsEnum } from "./Subjects";
import { TicketCreatedEvent } from "./Event-Data";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // readonly makes property unchangeable
  // the type annotation is required to conform to the generic type property required in TicketCreatedEvent,ie so that one of the other Enums is not passed in accidentally
  readonly subject: SubjectsEnum.TicketCreated = SubjectsEnum.TicketCreated; //
  qGroupName = "payments-service";

  handleMessage(messageData: TicketCreatedEvent["data"], msg: Message) {
    console.log(` data: ${JSON.stringify(messageData, null, 2)}`);

    msg.ack();
  }
}
