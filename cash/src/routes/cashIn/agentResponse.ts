import express, {Request,Response} from "express";
import { validateRequest, BadRequestError, NotFoundError } from '@dstransaction/common';
import { NotificationCreatedPublisher } from "../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../nats-wrapper";


const router=express.Router();


router.post('/api/cash/cashIn/agentResponse',async(req:Request,res:Response)=>{
    //hit api for response to agent app
    res.status(200).json({message:"response sent successfully"})    
})


export {router as cashInAgentResponse}