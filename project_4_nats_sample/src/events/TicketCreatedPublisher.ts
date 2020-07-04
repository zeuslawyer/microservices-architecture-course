import { Publisher } from "./BasePublisher";
import { TicketCreatedEvent } from "./Event-Data";
import { SubjectsEnum } from "./Subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: SubjectsEnum.TicketCreated = SubjectsEnum.TicketCreated;
}
