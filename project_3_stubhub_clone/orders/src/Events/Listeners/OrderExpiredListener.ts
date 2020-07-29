import {
  OrderExpiredEvent,
  Listener,
  SubjectsEnum,
  OrderStatus,
} from "@zeuscoder-public/microservices-course-shared";
import { Message } from "node-nats-streaming";
import { qGroupName } from "./qGroupName";
import { Order } from "../../Models/Order";
import { OrderCanceledPublisher } from "../Publishers/OrderCanceledPublisher";

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
  subject: SubjectsEnum.OrderExpired = SubjectsEnum.OrderExpired;
  qGroupName: string = qGroupName;

  async handleMessage(messageData: OrderExpiredEvent["data"], msg: Message) {
    // retrieve order
    const order = await Order.findById(messageData.orderId).populate("ticket");
    if (!order) {
      throw new Error(`Order with id '${messageData.orderId}' not found.`);
    }

    // ensure order isnt already complete
    if (order.status === OrderStatus.Complete) {
      msg.ack();
      return;
    }

    // update order status
    order.set({ status: OrderStatus.Canceled }); // the Ticket model has isReserved() checker which derives ticket status from the orderStatus enum. So this change is enough.
    await order.save();

    new OrderCanceledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
    });

    msg.ack();
  }
}
