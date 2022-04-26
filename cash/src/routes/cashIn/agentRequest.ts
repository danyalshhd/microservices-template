import express, {Request,Response} from "express";
import { validateRequest, BadRequestError, NotFoundError } from '@dstransaction/common';
import { NotificationCreatedPublisher } from "../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../nats-wrapper";


const router=express.Router();


router.post('/api/cash/cashIn/agentRequest',async(req:Request,res:Response)=>{
    const {userId,title,createdAt}=req.body
    await new NotificationCreatedPublisher(natsWrapper.client).publish({
        id:userId,
        title:title,
        createdAt:createdAt
    })
})


export {router as cashInAgentRequestRouter}