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
    const { id, title, price } = messageData;
    const ticket = await Ticket.findById(id);

    if (!ticket) throw new Error("Ticket not found in update listener");

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
