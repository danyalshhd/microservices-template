import { BadRequestError, validateRequest } from '@dstransaction/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Country } from '../../models/user-configuration/country';
const router = express.Router();

router.post(
  '/api/product/country',
  validateRequest,
  async (req: Request, res: Response) => {
    const { countryName, countryCode, phonePrefix, visible = true } = req.body;
    let existingCountry = await Country.findOne({
      countryName,
      countryCode,
    });
    if (existingCountry) {
      throw new BadRequestError(
        'Country with this name and code already exists.'
      );
    }
    const country = Country.build({
      countryName,
      countryCode,
      phonePrefix,
      visible,
    });
    await country.save();
    res.status(201).send(country);
  }
);

router.get(
  '/api/product/country',
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { countryName, countryCode, phonePrefix, visible } = req.body;
      let queryObj: any = {};
      countryName && (queryObj.countryName = countryName);
      countryCode && (queryObj.countryCode = countryCode);
      phonePrefix && (queryObj.phonePrefix = phonePrefix);
      visible && (queryObj.visible = visible);
      let countries = await Country.find(queryObj);
      res.send(countries);
    } catch (error) {
      throw new BadRequestError('Unable to retrieve countries.');
    }
  }
);

router.put(
  '/api/product/country',
  [
    body('id').isString(),
    body('countryName').optional().isString(),
    body('countryCode').optional().isString(),
    body('phonePrefix').optional().isString(),
    body('visible').optional().isBoolean(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id, countryName, countryCode, phonePrefix, visible } = req.body;
      let updateObj: any = {};
      countryName && (updateObj.countryName = countryName);
      countryCode && (updateObj.countryCode = countryCode);
      phonePrefix && (updateObj.phonePrefix = phonePrefix);
      visible != null && (updateObj.visible = visible);
      const updatedCountry = await Country.findOneAndUpdate(
        { _id: id },
        updateObj,
        {
          new: true,
        }
      );
      res.send(updatedCountry);
    } catch (error) {
      throw new BadRequestError('Unable to update Country.');
    }
  }
);

router.delete(
  '/api/product/country',
  body('id').isString(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const deletedCountry = await Country.findOneAndDelete({ _id: id });
      if (!deletedCountry) {
        throw new Error();
      }
      res.send(deletedCountry);
    } catch (error) {
      throw new BadRequestError('Unable to delete Country.');
    }
  }
);

export { router as countryRouter };

// router.post(
//   '/api/product/country',
//   validateRequest,
//   async (req: Request, res: Response) => {
//     try {
//       const { countries } = req.body;
//       console.log(countries[0]);
//       let modifyCountries: any = await countries;
//       modifyCountries.forEach((country: any) => {
//         delete Object.assign(country, { ['countryName']: country['name'] })[
//           'name'
//         ];
//         delete Object.assign(country, { ['countryCode']: country['isoCode'] })[
//           'isoCode'
//         ];
//         delete Object.assign(country, {
//           ['phonePrefix']: country['dialCode'],
//         })['dialCode'];
//       });
//       //   modifyCountries.forEach((country: any) => {
//       //     if (country.countryName === 'Cayman Islands') {
//       //       country.phonePrefix = '+1345';
//       //     }
//       //   });
//       const added = await Country.insertMany(modifyCountries);
//       res.send('addded');
//     } catch (error) {
//       console.log(error);
//       throw new BadRequestError('Unable to add Countries');
//     }
//   }
// );
