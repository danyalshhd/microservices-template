import { Listener, AccountCreatedEvent, Subjects, AccountStatus } from "@dstransaction/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.AccountCreated = Subjects.AccountCreated;

    async onMessage(data: AccountCreatedEvent['data'], msg: Message) {

    }
}