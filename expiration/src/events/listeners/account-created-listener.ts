import { AccountCreatedEvent, Listener, Subjects } from "@dstransaction/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
    subject: Subjects.AccountCreated = Subjects.AccountCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
        await expirationQueue.add({
            accountId: data.id
        });

        msg.ack();
    }
}