import mongoose from 'mongoose';
import { app } from './app';import { randomBytes } from 'crypto';
import { natsWrapper } from './nats-wrapper';
import { TransactionCreatedListener } from './events/listeners/transaction-created-listener';
import { TransactionUpdatedListener } from './events/listeners/transaction-updated-listener';

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
    console.log(process.env.NATS_CLUSTER_ID);
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID.trim(), randomBytes(4).toString('hex'), process.env.NATS_URL);

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINIT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TransactionCreatedListener(natsWrapper.client).listen();
    new TransactionUpdatedListener(natsWrapper.client).listen();

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