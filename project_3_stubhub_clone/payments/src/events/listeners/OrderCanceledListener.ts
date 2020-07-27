import {
  OrderCanceledEvent,
  Listener,
  SubjectsEnum,
  OrderStatus,
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";
import { qGroupName } from "./qGroupName";
import { Order } from "../../models/order";

export class OrderCanceled extends Listener<OrderCanceledEvent> {
  subject: SubjectsEnum.OrderCanceled = SubjectsEnum.OrderCanceled;
  qGroupName = qGroupName;

  async handleMessage(messageData: OrderCanceledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: messageData.id,
      version: messageData.version - 1,
    });

    if (!order) {
      throw new Error(
        `Cannot find order with id '${messageData.id}' at version '${messageData.version}'`
      );
    }

    order.set({ status: OrderStatus.Canceled });
    await order.save();

    msg.ack();
  }
}
