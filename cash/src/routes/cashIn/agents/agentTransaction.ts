import express, {Request,Response} from "express";
import { validateRequest, BadRequestError, NotFoundError } from '@dstransaction/common';
import { NotificationCreatedPublisher } from "../../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../../nats-wrapper";
import { body } from "express-validator";
import { User } from "../../../models/user";
import { AgentCashIn } from "../../../models/request";
import mongoose from "mongoose";


const router=express.Router();


router.post(
    '/api/cash/cashIn/agentTransaction',[
    body('email').isEmail().withMessage('Email must be valid')],
    async(req:Request,res:Response)=>
    {
    const {email,amount, agentId}=req.body;
    const user=await User.findOne({email});
    if(!user){
        throw new BadRequestError("user does not exist")
    }
    if(!mongoose.isValidObjectId(agentId)){
        throw new BadRequestError("You did not enter a valid Agent Id")
    }
    
    try{
        await new NotificationCreatedPublisher(natsWrapper.client).publish({
            id:user._id,
            title:`Cash in amount of ${amount} from Agent ${agentId}`,
            createdAt:new Date(),
        })

        const request= await AgentCashIn.create({
            userId:(user._id),
            createdAt:new Date(),
            agentId:new mongoose.Types.ObjectId(agentId),
            cash_in_out:"in",
            amount:amount,
        })
        await request.save()
        res.status(200).json({message: `notification sent to user ${user.email}`, payload:request})
    }catch(err){
        console.log(err)
        throw new BadRequestError('internal server error')
    }
})


export {router as cashInAgentTransactionRouter}