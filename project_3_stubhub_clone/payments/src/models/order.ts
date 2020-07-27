import mongoose from "mongoose";
import { OrderStatus } from "@zeuscoder-public/microservices-course-shared";

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const schemaOpts: mongoose.SchemaOptions = {
  toJSON: {
    transform(_, returned) {
      returned.id = returned._id;
      delete returned._id;
    },
  },
};
const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
  },
  userId: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  schemaOpts,
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.price,
    status: attrs.status,
    userId: attrs.userId,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
