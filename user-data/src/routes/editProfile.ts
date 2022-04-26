import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import path from 'path';
import { Password } from '../services/password';
import { User } from '../models/user';
import { uploadFile } from './upload-image';
import { validateRequest, BadRequestError } from '@dstransaction/common';
const multer = require('multer');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    // filename: function (req: any, file: any, cb: Function) {
    //   cb(null, `${file.filename}.${file.mimetype.split('/')[1]}`);
    // },
  }),
  fileFilter: (req: any, file: any, cb: Function) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new BadRequestError('File Type is not supported.'));
      return;
    }
    cb(null, true);
  },
});

router.put(
  '/api/users/editProfile',
  validateRequest,
  upload.single('image'),
  [
    body('userId').isString(),
    body('sourceOfIncome').optional().isAlpha(),
    body('streetAddress').optional().isObject(),
    body('email').optional().isEmail(),
  ],
  async (req: Request, res: Response) => {
    try {
      const { userId, sourceOfIncome, streetAddress, email } = req.body;
      let update: any = {};
      let addressKeys: any = [];
      sourceOfIncome != null && (update.sourceOfIncome = sourceOfIncome);
      email != null && (update.email = email);
      streetAddress && (addressKeys = Object.keys(streetAddress));
      addressKeys.length > 0 && (update.streetAddress = {});
      if (addressKeys.length > 0) {
        for (let i = 0; i < addressKeys.length; i++) {
          Boolean(streetAddress[addressKeys[i]].trim()) &&
            (update.streetAddress[addressKeys[i]] =
              streetAddress[addressKeys[i]].trim());
        }
      }
      if ((req as any).file) {
        const uploadImage = await uploadFile((req as any).file);
        update.profilePicture = uploadImage.Location;
      }
      const userUpdate = await User.findOneAndUpdate(
        { _id: userId },
        convertToDotNotation(update)
      );
      if (!userUpdate) {
        throw new Error();
      }
      console.log(JSON.stringify(convertToDotNotation(update)));
      res.send(userUpdate);
    } catch (error) {
      throw new BadRequestError('Unable to edit profile.');
    }
  }
);

function convertToDotNotation(obj: any, newObj: any = {}, prefix = '') {
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      convertToDotNotation(obj[key], newObj, prefix + key + '.');
    } else {
      newObj[prefix + key] = obj[key];
    }
  }

  return newObj;
}

export { router as editProfileRouter };
