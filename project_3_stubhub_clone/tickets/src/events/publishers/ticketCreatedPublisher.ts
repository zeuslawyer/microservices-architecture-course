import { Publisher, TicketCreatedEvent, SubjectsEnum as Channels } from "@zeuscoder-public/microservices-course-shared";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Channels.TicketCreated = Channels.TicketCreated;
}
