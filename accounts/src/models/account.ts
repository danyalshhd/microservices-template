import mongoose from 'mongoose';
import { AccountStatus } from '@dstransaction/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TransactionDoc } from './transaction';

interface AccountAttrs {
    userId: string;
    status: AccountStatus;
    expiresAt: Date;
    transaction: TransactionDoc;
}

interface AccountDoc extends mongoose.Document {
    userId: string;
    status: AccountStatus;
    expiresAt: Date;
    transaction: TransactionDoc;
    version: number;
}

interface AccountModel extends mongoose.Model<AccountDoc> {
    build(attrs: AccountAttrs): AccountDoc;
}

const accountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(AccountStatus),
        default: AccountStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

accountSchema.set('versionKey', 'version');
accountSchema.plugin(updateIfCurrentPlugin);

accountSchema.statics.build = (attrs: AccountAttrs) => {
    return new Account(attrs);
}

const Account = mongoose.model<AccountDoc, AccountModel>('Account', accountSchema);

export { Account };
