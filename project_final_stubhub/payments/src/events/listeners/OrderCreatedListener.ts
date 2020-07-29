import {
  OrderCreatedEvent,
  Listener,
  SubjectsEnum,
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";
import { qGroupName } from "./qGroupName";
import { Order } from "../../models/Order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
  qGroupName = qGroupName;

  async handleMessage(messageData: OrderCreatedEvent["data"], msg: Message) {
    // create order
    const order = Order.build({
      id: messageData.id,
      version: messageData.version,
      status: messageData.status,
      userId: messageData.userId,
      price: messageData.ticket.price,
    });

    await order.save();

    msg.ack();
  }
}
