import { onfido, readWebhookEvent } from '../config/onfidoConfig';
import express, { Request, Response } from 'express';
import { natsWrapper } from '../nats-wrapper';
import { NotificationCreatedPublisher } from '../events/publishers/notification-created-publisher';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
} from '@dstransaction/common';
import { User } from '../models/user';
const router = express.Router();

router.post(
  '/api/onfido/applicant',
  [
    body('firstName')
      .isAlpha()
      .withMessage('First Name must have alphabets only.'),
    body('lastName')
      .isAlpha()
      .withMessage('Last Name must have alphabets only.'),
    body('dob').optional().isDate().withMessage('Invalid Date'),
    body('address').optional().isObject(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      //get userid also and save the applicant there
      const { firstName, lastName, dob, address, userId } = req.body;
      let applicantObj: any = {
        firstName,
        lastName,
      };
      if (dob) {
        applicantObj.dob = dob;
      }
      if (address) {
        applicantObj.address = address;
      }
      const applicant = await onfido.applicant.create(applicantObj);
      await User.updateOne(
        { _id: userId },
        { onfidoApplicantId: applicant.id }
      );
      const applicantId = applicant.id;
      const sdkToken = await onfido.sdkToken.generate({
        applicantId,
        applicationId: 'com.digicell.mycash',
      });
      res.status(201).send({ ...applicant, sdkToken: sdkToken });
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

router.post(
  '/api/onfido/check',
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { applicantId, documentId } = req.body;
      let checkObject: any = { applicantId, asynchronus: false };
      if (documentId) {
        checkObject.documentId = [documentId];
      }
      checkObject.reportNames = ['document', 'facial_similarity_photo'];
      const check = await onfido.check.create(checkObject);
      await User.updateOne(
        { onfidoApplicantId: applicantId },
        { onfidoCheckId: check.id, upgradeToMax: 'in_progress' }
      );
      res.send(check);
    } catch (error) {
      console.log(error);
      throw new BadRequestError('Unable to create check');
    }
  }
);

router.get(
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
    //Logic to handle completed check and Push-Notification.
    await new NotificationCreatedPublisher(natsWrapper.client).publish({
      id: 'RegistrationToken',
      title: 'Check Completed',
      createdAt: new Date(),
    });
    res.status(200).send('ok');
  } catch (error) {
    throw new NotAuthorizedError();
  }
});

export { router as onfidoRouter };
