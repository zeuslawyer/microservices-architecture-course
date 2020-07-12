import mongoose from "mongoose";
import { Order } from "./Order";
import { OrderStatus } from "@zeuscoder-public/microservices-course-shared";

/**
 * This Ticket model is created ONLY for user by Orders.
 * It does not replicate the Ticket service's model because it may not need all that functionality.
 * This model implements only what is necessary for the Orders service to work
 */
interface TicketAttrs {
  title: string;
  price: number;
}

// properties of an instance of Ticket mongo doc
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// The mongo model for Ticket
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const schemaOpts: mongoose.SchemaOptions = {
  toJSON: {
    transform(doc, returned) {
      returned.id = doc._id;
      delete returned._id;
    }
  }
};

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    }
  },
  schemaOpts
);

// add method to collection
ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs); // add method to the mongo collection

// add method to each document
ticketSchema.methods.isReserved = async function () {
  // add method to the individual document.... MUST use function keyword in assignment in order to access this context
  //  check reserved status - i.e. order status is NOT canceled
  const existingOrder = await Order.findOne({
    ticket: this, // ticket that calls this method
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment
      ]
    }
  });

  // open order exists then that ticket is reserved
  return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  ticketSchema
);
