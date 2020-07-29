import { Listener } from "./BaseListener";
import { Message } from "node-nats-streaming";
import { SubjectsEnum } from "./Subjects";
import { TicketUpdatedEvent } from "./Event-Data";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  // readonly makes property unchangeable
  // the type annotation is required to conform to the generic type property required in TicketCreatedEvent,ie so that one of the other Enums is not passed in accidentally
  readonly subject: SubjectsEnum.TicketUpdated = SubjectsEnum.TicketUpdated;
  qGroupName = "payments-service";

  handleMessage(messageData: TicketUpdatedEvent["data"], msg: Message) {
    console.log(` data: ${JSON.stringify(messageData, null, 2)}`);

    msg.ack();
  }
}
