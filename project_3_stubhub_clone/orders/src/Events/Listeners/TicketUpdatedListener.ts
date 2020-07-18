import {
  Listener,
  SubjectsEnum,
  TicketUpdatedEvent
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";

import { qGroupName } from "./qGroupName";
import { Ticket } from "../../Models/Ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: SubjectsEnum.TicketUpdated = SubjectsEnum.TicketUpdated;
  qGroupName = qGroupName;

  async handleMessage(messageData: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(messageData.id);

    if (!ticket) throw new Error("Ticket not found in Orders Update listener");

    ticket.set({
      title: messageData.title,
      price: messageData.price,
      version: messageData.version // save the new version that came through on the event
    });
    await ticket.save();

    msg.ack();
  }
}
