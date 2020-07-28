import {
  Publisher,
  PaymentCreatedEvent,
  SubjectsEnum,
} from "@zeuscoder-public/microservices-course-shared";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: SubjectsEnum.PaymentCreated = SubjectsEnum.PaymentCreated;
}
