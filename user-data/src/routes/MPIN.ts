import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser } from '@dstransaction/common';
import { User } from '../models/user';
import {Password} from '../services/password';
import { BadRequestError, NotAuthorizedError } from '@dstransaction/common';

const router = express.Router()

router.post('/api/users/verifympin', currentUser , (req: Request, res: Response) => {
    let { mpin } = req.body;
    let currentUser_1 = JSON.stringify(req.currentUser);
    let currentUser_2 = JSON.parse(currentUser_1)
    let {sub} = currentUser_2;
    User.findOne({ _id: sub },
        { mpin: 1 , _id: 0}, async (err: any, docs: any) => {
        if (err){
            throw new BadRequestError('Unable to verify MPin.')
        }
        else{
            const mpinMatch = await Password.compare(
                docs.mpin,
                mpin
              );
            if (!mpinMatch)
            {
                // res.status(401).send(`Wrong MPIN`);
                throw new NotAuthorizedError()
            }
            else
            {   let response = { results: {message: 'SUCCESS'}}
                res.status(200).send(response);
                return;
            }
        }
    });
})
export { router as verifyMPIN };