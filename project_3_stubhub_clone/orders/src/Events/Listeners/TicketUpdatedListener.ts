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
    const { id, title, price, version } = messageData;
    const ticket = await Ticket.findOne({ _id: id, version: version! - 1 }); // -1 as the tickets service would have updated version and orders service would have n-1

    if (!ticket) throw new Error("Ticket not found in update listener");

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
