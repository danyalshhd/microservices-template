import express, {Request,Response} from "express";
import { validateRequest, BadRequestError, NotFoundError } from '@dstransaction/common';
import { NotificationCreatedPublisher } from "../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { AgentCashOut } from "../../models/request";
import { body } from "express-validator";
import { User } from "../../models/user";
import mongoose from "mongoose";


const router=express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/cash/cashOut/agentRequest',
[body('email').isEmail().withMessage('Email must be valid')],
async(req:Request,res:Response)=>{
    const {email,amount,agentId}=req.body

    const user=await User.findOne({email});
    if(!user){
        throw new BadRequestError("user does not exist")
    }
    if(!mongoose.isValidObjectId(agentId)){
        throw new BadRequestError("You did not enter a valid Agent Id")
    }
    try{

        
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        const request= await AgentCashOut.create({
            userId:user._id,
            createdAt:new Date(),
            agentId:new mongoose.Types.ObjectId(agentId),
            cash_in_out:"out",
            amount,
            status:"created",
            expiresAt:expiration,
        })
        await request.save()


        await new NotificationCreatedPublisher(natsWrapper.client).publish({
            id:user._id,
            title:`Cash Out amount of ${amount} from Agent ${agentId}`,
            createdAt:new Date(),
        })

        request.status="pending";
        await request.save()
        res.status(200).json({message:`notification sent to user ${user.email}`,payload:request})
    }catch(err){
        console.log(err)
        throw new BadRequestError('internal server error')
    }
    })


export {router as cashOutAgentRequestRouter}