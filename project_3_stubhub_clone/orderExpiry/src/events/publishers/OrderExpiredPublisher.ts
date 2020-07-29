import {
  OrderExpiredEvent,
  Publisher,
  SubjectsEnum,
} from "@zeuscoder-public/microservices-course-shared";

export class OrderExpiredPublisher extends Publisher<OrderExpiredEvent> {
  subject: SubjectsEnum.OrderExpired = SubjectsEnum.OrderExpired;
}
