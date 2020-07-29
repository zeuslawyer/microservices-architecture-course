import {
  Publisher,
  OrderCanceledEvent,
  SubjectsEnum
} from "@zeuscoder-public/microservices-course-shared";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  subject: SubjectsEnum.OrderCanceled = SubjectsEnum.OrderCanceled;
}
