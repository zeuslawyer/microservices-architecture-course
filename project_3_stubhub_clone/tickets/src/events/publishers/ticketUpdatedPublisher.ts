import { Publisher, SubjectsEnum as Channels, TicketUpdatedEvent } from "@zeuscoder-public/microservices-course-shared";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Channels.TicketUpdated = Channels.TicketUpdated;
}
