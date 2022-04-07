let AWS_BUCKET_NAME = 'digicell-bucket';
let AWS_BUCKET_REGION = 'ap-southeast-1';
let ACCESS_KEY_ID = 'AKIARJ5OYBXGRVHTQM6W';
let AWS_SECRET_ACCESS_KEY = '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';

import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import express from 'express';
import { body } from 'express-validator';
import path from 'path';
import { validateRequest, BadRequestError } from '@dstransaction/common';
const multer = require('multer');
// const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// const poolData = {
//   UserPoolId: 'us-east-1_cBhmA75S1',
//   ClientId: '1kffecgahvsb2cnmg00avkup6h',
// };

// const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
// userPool.signUp()

let bucketName = AWS_BUCKET_NAME;
let region = AWS_BUCKET_REGION;
let accessKeyId = ACCESS_KEY_ID;
let secretAccessKey = AWS_SECRET_ACCESS_KEY;

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    // filename: function (req, file, cb) {
    //   cb(null, `${file.filename}.${file.mimetype.split("/")[1]}`);
    // },
  }),
  fileFilter: (req: any, file: any, cb: Function) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported.'), false);
      return;
    }
    cb(null, true);
  },
});

const s3 = new S3({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

function uploadFile(file: any) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${file.filename}.${file.mimetype.split('/')[1]}`,
    //masla is file name
  };
  return s3.upload(uploadParams).promise();
}

router.post(
  '/api/users/imageUpload',
  upload.single('image'),
  async (req: any, res) => {
    try {
      let uploadImage = await uploadFile(req.file);
      res.send(uploadImage);
    } catch (error) {
      res.send(error);
    }
  }
);

export { uploadFile, router as imageRouter };
