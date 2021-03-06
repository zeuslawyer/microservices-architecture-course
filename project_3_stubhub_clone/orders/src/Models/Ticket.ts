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
  id: string;
}

// properties of an instance of Ticket mongo doc
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// The mongo model for Ticket, with custom functions
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const schemaOpts: mongoose.SchemaOptions = {
  toJSON: {
    transform(doc, returned) {
      returned.id = returned._id;
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

// set version property on the mongoose document object
ticketSchema.set("versionKey", "version");

// pre save hook, needs old school function, as uses 'this'
ticketSchema.pre("save", function (done) {
  // @ts-ignore
  this.$where = {
    version: this.get("version") - 1 // save  pre hook  checks that the current ticket doc being saved is only 1+ version in db
  };

  done();
});

// add method at collection level
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const ticket = { ...attrs, _id: attrs.id }; // mongo objects use _id in db, so must conform.  in this project gets converted to id only when converting to JSON in schemaOpts
  delete ticket.id;

  return new Ticket(ticket);
};

// add method at the document level
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
