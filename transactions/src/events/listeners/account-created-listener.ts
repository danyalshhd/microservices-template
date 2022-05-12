import { Listener, AccountCreatedEvent, Subjects, AccountStatus } from "@dstransaction/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Transaction } from "../../models/transaction";
import { TransactionUpdatedPublisher } from "../publishers/transaction-updated-publisher";

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.AccountCreated = Subjects.AccountCreated;

    async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
        const transaction = await Transaction.findById(data.transaction.id);

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        transaction.set({ accountId: data.id });

        await transaction.save();
        await new TransactionUpdatedPublisher(this.client).publish({
            id: transaction.id,
            price: transaction.price,
            title: transaction.title,
            userId: transaction.userId,
            accountId: transaction.accountId,
            version: transaction.version,
        });

        msg.ack();
    }
}
