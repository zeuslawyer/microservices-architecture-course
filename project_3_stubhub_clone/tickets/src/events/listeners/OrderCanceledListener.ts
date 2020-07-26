import {
  Listener,
  OrderCanceledEvent,
  SubjectsEnum,
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";
import { qGroupName } from "./qGroupName";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  subject: SubjectsEnum.OrderCanceled = SubjectsEnum.OrderCanceled;
  qGroupName = qGroupName;

  async handleMessage(
    messageData: OrderCanceledEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(messageData.ticket.id);

    if (!ticket)
      throw new Error(`Ticket not found: '${messageData.ticket.id}'`);

    // order canceled
    ticket.set({ orderId: undefined });
    await ticket.save();

    // emit event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
