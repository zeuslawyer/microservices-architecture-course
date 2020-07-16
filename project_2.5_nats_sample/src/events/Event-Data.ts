import { SubjectsEnum } from "./Subjects";

interface BaseTicketData {
  id: string;
  price: number;
  title: string;
}

export interface TicketCreatedEvent {
  subject: SubjectsEnum.TicketCreated;
  data: BaseTicketData;
}

export interface TicketUpdatedEvent {
  subject: SubjectsEnum.TicketUpdated;
  data: BaseTicketData;
}
