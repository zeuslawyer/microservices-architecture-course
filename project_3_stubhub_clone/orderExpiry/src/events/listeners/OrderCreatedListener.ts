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

  async handleMessage(messageData: OrderCreatedEvent["data"], msg: Message) {
    const delay =
      new Date(messageData.expiresAt).getTime() - new Date().getTime();
    await expirationQ.add({ orderId: messageData.id }, { delay });

    msg.ack();
  }
}
