import {
  Listener,
  SubjectsEnum,
  TicketCreatedEvent
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../Models/Ticket";
import { qGroupName } from "./qGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: SubjectsEnum.TicketCreated = SubjectsEnum.TicketCreated;
  qGroupName: string = qGroupName; // needed for listeners so the same message doesnt get received in parallel by multiple instances of the listening app

  async handleMessage(messageData: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = messageData;
    const ticket = Ticket.build({
      id,
      title,
      price
    });

    await ticket.save;

    msg.ack();
  }
}
