import { Subjects, Publisher, AccountCancelledEvent } from '@dstransaction/common';

export class AccountCancelledPublisher extends Publisher<AccountCancelledEvent> {
  subject: Subjects.AccountCancelled = Subjects.AccountCancelled;
}
