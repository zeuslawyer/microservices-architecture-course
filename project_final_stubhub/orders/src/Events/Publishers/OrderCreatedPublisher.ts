import {
  Publisher,
  OrderCreatedEvent,
  SubjectsEnum
} from "@zeuscoder-public/microservices-course-shared";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
}
