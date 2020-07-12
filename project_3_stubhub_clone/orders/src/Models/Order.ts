import mongoose from "mongoose";

// attributes for creating an object via the custom build method below
export interface OrderAttrs {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc; // associated Ticket data type
}

// interface that describes the properties of each Order instance (the mongo document)
// which includes the additional props that mongo will add
// these are the attributes in the stored version of the object
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc; // reference to the Mongoose Ticket Id
}

// interface that describes the properties of the Or der Schema ( the model )
// this includes the custom "build" method that we will add on to the Mongo Order Schema
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(orderAttrs: OrderAttrs): OrderDoc;
}

// options to remove certain fields from the returned mongo doc when it is built
const schemaOpts: mongoose.SchemaOptions = {
  toJSON: {
    transform(doc, returned) {
      returned.id = returned._id;
      delete returned._id;
    }
  }
};

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket", // associated collection name
      required: true
    }
  },
  schemaOpts
);

// custom method called build to add typing to mongo api
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

// the Order model
export const Order = mongoose.model<any, OrderModel>("Order", orderSchema);
