import { Publisher, AccountCreatedEvent, Subjects } from '@dstransaction/common';

export class AccountCreatedPublisher extends Publisher<AccountCreatedEvent> {
  subject: Subjects.AccountCreated = Subjects.AccountCreated;
}
