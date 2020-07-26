import {
  Listener,
  OrderCreatedEvent,
  SubjectsEnum,
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";
import { qGroupName } from "./qGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
  qGroupName: string = qGroupName;

  async handleMessage(
    messageData: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
