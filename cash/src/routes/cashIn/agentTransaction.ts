import express, {Request,Response} from "express";
import { validateRequest, BadRequestError, NotFoundError } from '@dstransaction/common';
import { NotificationCreatedPublisher } from "../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { body } from "express-validator";
import { User } from "../../models/user";


const router=express.Router();


router.post(
    '/api/cash/cashIn/agentTransaction',[
    body('email').isEmail().withMessage('Email must be valid')],
    async(req:Request,res:Response)=>
    {
    const {email,amount, agentId}=req.body;
    const user=await User.findOne({email});
    if(user){
        await new NotificationCreatedPublisher(natsWrapper.client).publish({
            id:user._id,
            title:`Cash in amount of ${amount} from Agent ${agentId}`,
            createdAt:new Date(),
        })
        res.status(200).json({message: `notification sent to user ${user.email}`})
    }else{
        throw new BadRequestError("User not found")
    }
})


export {router as cashInAgentTransactionRouter}