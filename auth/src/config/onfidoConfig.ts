import { Onfido, Region, WebhookEventVerifier } from '@onfido/api';

const onfido = new Onfido({
  apiToken: process.env.ONFIDO_API_TOKEN ?? '',
  // Supports Region.EU, Region.US and Region.CA
  region: Region.US,
});

const webhookToken = 'hoDFlFjkaubtHn3fUGPGezkxPCCA-5E8';
const verifier = new WebhookEventVerifier(webhookToken);

const readWebhookEvent = (rawEventBody: string | Buffer, signature: string) => {
  try {
    return verifier.readPayload(rawEventBody, signature);
  } catch (error) {
    return;
  }
};

export { onfido, readWebhookEvent };
