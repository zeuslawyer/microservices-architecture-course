import {
  Listener,
  OrderCreatedEvent,
  SubjectsEnum,
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";
import { qGroupName } from "./qGroupName";
import { expirationQ } from "../../queues/queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
  qGroupName: string = qGroupName;

  async handleMessage(
    messageData: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    await expirationQ.add({ orderId: messageData.id });
    msg.ack();
  }
}
