import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface NotificationAttrs {
  title: string,
  body: string,
  createdAt:Date
  userId:string
  data:object
}

export interface NotificationDoc extends mongoose.Document {
    title: string,
    body: string,
    createdAt:Date,
    data:object,
    userId:string,
    version: number,
    //isAlreadyPresent(): Promise<boolean>;
}

interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
  findByEvent(event: { id: string, version: number }): Promise<NotificationDoc | null>;
}

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt:{
      type:Date,
      required:true,
  },
  data:{
      type:Object,
  },
  userId:{
    type:String,
    required:true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

NotificationSchema.set('versionKey', 'version');
NotificationSchema.plugin(updateIfCurrentPlugin);

NotificationSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Notification.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

NotificationSchema.statics.build = (attrs: NotificationAttrs) => {
  return new Notification({
    title: attrs.title,
    body: attrs.body,
    createdAt:attrs.createdAt,
    data:attrs.data,
    userId:attrs.userId
  })
}

// NotificationSchema.methods.isAlreadyPresent = async function() {
// due to function keyword we get this as 'Notification' current context.
  //return !!ex;
// }

const Notification = mongoose.model<NotificationDoc, NotificationModel>('Notification', NotificationSchema);

export { Notification };
