import { AccountCancelledEvent, Listener, Subjects } from "@dstransaction/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Transaction } from "../../models/transaction";
import { TransactionUpdatedPublisher } from "../publishers/transaction-updated-publisher";

export class AccountCancelledListener extends Listener<AccountCancelledEvent> {
    subject: Subjects.AccountCancelled = Subjects.AccountCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: AccountCancelledEvent['data'], msg: Message) {
        const transaction = await Transaction.findById(data.transaction.id);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        transaction.set({ accountId: undefined });

        await new TransactionUpdatedPublisher(this.client).publish({
            id: transaction.id,
            title: transaction.title,
            accountId: transaction.accountId,
            price: transaction.price,
            userId: transaction.userId,
            version: transaction.version,
        });
        msg.ack();
    }
}