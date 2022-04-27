import mongoose from 'mongoose';
import { app } from './app';
import { NotificationCreatedListener } from './events/listeners/notification-created-listener';
import { initializeFirebaseSDK } from './firebase/firebase';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
<<<<<<< HEAD
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
=======
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
>>>>>>> 324282cfe58ecca331acee4d034656e641fd3275

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINIT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

<<<<<<< HEAD

=======
>>>>>>> 324282cfe58ecca331acee4d034656e641fd3275
    initializeFirebaseSDK(JSON.parse(process.env.FIREBASE_CERT!));
    new NotificationCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
