import express, {Request,Response} from "express";
import { validateRequest, BadRequestError, NotFoundError, NotAuthorizedError } from '@dstransaction/common';
import { NotificationCreatedPublisher } from "../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { AgentCashOut } from "../../models/request";


const router=express.Router();


router.post('/api/cash/cashIn/agentResponse',async(req:Request,res:Response)=>{
    //hit api for response to agent app
    const {userId,requestId,status}=req.body
    const request=await AgentCashOut.findById(requestId);
    if(!(status==="accepted" || status==="rejected")){
        throw new BadRequestError("Incorrect Status")
    }
    if(!request){
        throw new BadRequestError("request does not exist")
    }
    if (request.userId!=userId){
        throw new NotAuthorizedError()
    }
    request.status=status;
    try{
        await request.save()
    }
    catch(err){
        console.log(err)
        throw new BadRequestError("internal server error")
    }
    res.status(200).json({message:"response sent successfully", status:request.status, id:requestId})    
})


export {router as cashOutAgentResponse}