import { onfido, readWebhookEvent } from '../config/onfidoConfig';
// import { WebhookEventVerifier, Webhook, WebhookEvent, WebhookRequest } from '@onfido/api';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import path from 'path';
import fs from 'fs';
import {
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
} from '@dstransaction/common';

const router = express.Router();

router.post(
  '/api/onfido/applicant',
  [
    body('firstName').isAlpha().withMessage('Name must have alphabets only.'),
    body('lastName').isAlpha().withMessage('Name must have alphabets only.'),
    body('dob').optional().isDate().withMessage('Invalid Date'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, dob, email, address } = req.body;
      let applicantObj: any = {
        firstName,
        lastName,
      };
      if (dob) {
        applicantObj.dob = dob;
      }
      if (email) {
        applicantObj.email = email;
      }
      if (address) {
        applicantObj.address = address;
      }
      const applicant = await onfido.applicant.create(applicantObj);
      res.status(201).send(applicant);
    } catch (error) {
      throw new BadRequestError('Unable to create applicant.');
    }
  }
);

router.post(
  '/api/onfido/sdk',
  [body('applicantId').exists()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { applicantId, applicationId } = req.body;
      const sdkToken = await onfido.sdkToken.generate({
        applicantId,
        applicationId: applicationId ?? 'com.digicell.mycash',
      });
      res.send({ token: sdkToken });
    } catch (error) {
      throw new BadRequestError('Unable to create sdk Token.');
    }
  }
);

router
  .post(
    '/api/onfido/check',
    validateRequest,
    async (req: Request, res: Response) => {
      try {
        const { applicantId, documentId } = req.body;
        let checkObject: any = { applicantId };
        if (documentId) {
          checkObject.documentId = [documentId];
        }
        checkObject.reportNames = ['document', 'facial_similarity_photo'];
        let check = await onfido.check.create(checkObject);
        res.send(check);
      } catch (error) {
        throw new BadRequestError('Unable to create check');
      }
    }
  )
  .get(
    '/api/onfido/check/:checkId',
    validateRequest,
    async (req: Request, res: Response) => {
      try {
        const { checkId } = req.params;
        let check = await onfido.check.find(checkId);
        res.send(check);
      } catch (error) {
        throw new BadRequestError('Unable to retrieve check.');
      }
    }
  );

router.get(
  '/api/onfido/report/:reportId',
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { reportId } = req.params;
      let report = await onfido.report.find(reportId);
      res.send(report);
    } catch (err) {
      throw new BadRequestError('Unable to retrieve report.');
    }
  }
);

router.post('/api/onfido/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-sha2-signature'] as string;
    let verifiedBody = readWebhookEvent(JSON.stringify(req.body), signature);
    res.status(200).send('ok');
  } catch (error) {
    throw new NotAuthorizedError();
  }
});

export { router as onfidoRouter };
