import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TransactionCreatedEvent } from '@dstransaction/common';
import { Transaction } from '../../models/transaction';
import { queueGroupName } from './queue-group-name';

export class TransactionCreatedListener extends Listener<TransactionCreatedEvent> {
  subject: Subjects.TransactionCreated = Subjects.TransactionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionCreatedEvent['data'], msg: Message) {
    console.log('hello world');
    const { id, title, price } = data;

    const transaction = Transaction.build({
      id,
      title,
      price,
    });
    await transaction.save();

    msg.ack();
  }
}
