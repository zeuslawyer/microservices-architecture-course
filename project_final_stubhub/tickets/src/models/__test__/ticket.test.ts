import { Ticket } from "../ticket";

it("implements optimistic concurrency version control", async done => {
  // create ticket and save to db
  const ticket = Ticket.build({
    title: "concurrency rocks",
    price: 32,
    userId: "234"
  });

  await ticket.save();

  // fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  expect(firstInstance!.version).toEqual(secondInstance!.version);

  // make a change to each
  firstInstance!.set({ title: "concurrency updates rock" });
  secondInstance!.set({ price: 99 });
  // save first, then second ticket
  await firstInstance!.save(); // on saving the version number will change

  // check that second save throws error, if  "mongoose-update-if-current" is working
  try {
    await secondInstance!.save();
  } catch (error) {
    return done(); // will pass the test
  }

  throw new Error(" Should not reach this point");
});

it("increments version on successive saves", async () => {
  // create ticket and save to db
  const ticket = Ticket.build({
    title: "concurrency versioning rocks",
    price: 32,
    userId: "234"
  });

  await ticket.save(); //  versions are generated on calling .save()
  expect(ticket.version).toEqual(0);

  // update
  ticket.set({ title: "Updated Title" });
  await ticket.save();
  expect(ticket.version).toEqual(1);

  // save again...
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
