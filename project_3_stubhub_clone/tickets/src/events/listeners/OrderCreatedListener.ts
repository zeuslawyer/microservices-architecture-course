import {
  Listener,
  OrderCreatedEvent,
  SubjectsEnum,
  TicketUpdatedEvent,
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";
import { qGroupName } from "./qGroupName";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
  qGroupName: string = qGroupName;

  async handleMessage(
    messageData: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(messageData.ticket.id);
    if (!ticket)
      throw new Error(`Ticket with id '${messageData.ticket.id}' not found.`);

    // to show that this ticket is "locked" add the orderId prop to it
    ticket.set({ orderId: messageData.id });
    await ticket.save();

    // @ts-ignore
    await new TicketUpdatedPublisher(this.client!).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId as string,
    });

    // ack
    msg.ack();
  }
}
