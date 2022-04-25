import { Publisher, Subjects, NotificationCreatedEvent } from '@dstransaction/common';

export class NotificationCreatedPublisher extends Publisher<NotificationCreatedEvent> {
  readonly subject: Subjects.NotificationCreated = Subjects.NotificationCreated;
}
