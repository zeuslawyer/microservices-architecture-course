import {
  PaymentCreatedEvent,
  Listener,
  SubjectsEnum,
  OrderStatus,
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";
import { qGroupName } from "./qGroupName";
import { Order } from "../../Models/Order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: SubjectsEnum.PaymentCreated = SubjectsEnum.PaymentCreated;
  qGroupName = qGroupName;

  async handleMessage(messageData: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(messageData.orderId);

    if (!order) {
      throw new Error(
        `Cannot find order with id '${messageData.orderId}' linked to payment id '${messageData.id}'`
      );
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
