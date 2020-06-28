import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// interface that describes the properties of each Ticket instance (the mongo document)
// which includes the additional props that mongo will add
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// interface that describes the properties of the Ticket Schema ( the model )
// this includes the custom "build" method that we will add on to the Mongo Ticket Schema
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticketAttrs: TicketAttrs): TicketDoc;
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

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String, // not typescript. Mongoose string (JS)
      required: true
    },
    price: {
      type: Number, // not typescript. Mongoose Number (JS)
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  schemaOpts
);

// custom method called build to add typing to mongo api
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// the Ticket model
export const Ticket = mongoose.model<any, TicketModel>("Ticket", ticketSchema);
