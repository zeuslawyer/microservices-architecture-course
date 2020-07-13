import {
  Publisher,
  TicketCreatedEvent,
  SubjectsEnum
} from "@zeuscoder-public/microservices-course-shared";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: SubjectsEnum.TicketCreated = SubjectsEnum.TicketCreated;
}
