import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TransactionUpdatedEvent } from '@dstransaction/common';
import { Transaction } from '../../models/transaction';
import { queueGroupName } from './queue-group-name';

export class TransactionUpdatedListener extends Listener<TransactionUpdatedEvent> {
  subject: Subjects.TransactionUpdated = Subjects.TransactionUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionUpdatedEvent['data'], msg: Message) {
    const transaction = await Transaction.findByEvent(data);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const { title, price } = data;
    transaction.set({ title, price });
    await transaction.save();

    msg.ack();
  }
}
