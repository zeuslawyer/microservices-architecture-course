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

  async handleMessage(ticketData: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(ticketData.id);

    if (!ticket) throw new Error("Ticket not found in Orders Update listener");

    ticket.set({
      title: ticketData.title,
      price: ticketData.price,
      version: ticketData.version // save the new version that came through on the event
    });

    await ticket.save();

    // ack will only end if ticket saves.  Ticket will not save if the pre hook finds version number mismatch.
    msg.ack();
  }
}
