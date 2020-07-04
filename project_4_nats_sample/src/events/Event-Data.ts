import { SubjectsEnum } from "./Subjects";

export interface TicketCreatedEvent {
  subject: SubjectsEnum.TicketCreated;
  data: {
    id: string;
    price: number;
    title: string;
  };
}
