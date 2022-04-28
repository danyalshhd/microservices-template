import { Message } from 'node-nats-streaming';
import { Subjects, Listener, NotificationCreatedEvent } from '@dstransaction/common';
import firebase from 'firebase-admin'
import { Notification } from '../../models/notification';
export class NotificationCreatedListener extends Listener<NotificationCreatedEvent> {
  subject: Subjects.NotificationCreated = Subjects.NotificationCreated;
  queueGroupName = "notifications-service";

  async onMessage(dat: NotificationCreatedEvent['data'], msg: Message) {

    
    try{
      console.log('hello world');
      const title=dat.title;
      const body="this is a sample notification";
      const data={timeStamp:String(dat.createdAt)}
      const userId=dat.id
      const createdAt=dat.createdAt
      const payload={
        notification:{
          title:title,
          body:body,
        },
        data:{
          ...data
        },
        token:userId
      };
      
      const notification=Notification.build({
                  title,
                  body,
                  createdAt,
                  data,
                  userId,
                })
      await notification.save()
      // await firebase.messaging().send(payload);
      console.log('sent: ',payload);
    }catch(err){
        console.log(err)
    }

    msg.ack();
  }
}
