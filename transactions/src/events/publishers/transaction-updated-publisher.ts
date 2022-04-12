import { Publisher, Subjects, TransactionUpdatedEvent } from '@dstransaction/common';

export class TransactionUpdatedPublisher extends Publisher<TransactionUpdatedEvent> {
  readonly subject = Subjects.TransactionUpdated;
}
