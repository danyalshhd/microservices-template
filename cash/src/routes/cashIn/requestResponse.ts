import express, {Request,Response} from "express";
import {  BadRequestError, NotAuthorizedError, NotFoundError } from "@dstransaction/common";
import { NotificationCreatedPublisher } from "../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { Requests } from "../../models/request";

const router=express.Router()

router.post('/api/cash/cashIn/requestResponse',async(req:Request,res:Response)=>{
        const {status,requestId,userId}=req.body
        //validating status
        if(!(status==="accepted" || status==="cancelled")){
            throw new BadRequestError("Incorrect Status")
        }
        //checking if current user is authorized to access request
        const request_check=await Requests.findOne({"requests.id":requestId},{"requests.$":1, "userId":1})
        
        if(!request_check || (request_check.requests[0].friendId!==userId)){
            throw new NotAuthorizedError()
        }


        // changing the request status
        const request =await Requests.findOneAndUpdate({"requests.id":requestId, "requests.friendId":userId},
                                                        {$set:{"requests.$.status":status}},
                                                        {new:true, projection:{ requests:{'$elemMatch':{id:requestId}}}})


        // sending the request response to requestor
        await new NotificationCreatedPublisher(natsWrapper.client).publish({
            id:request_check.userId,
            title:'Money Request Response',
            createdAt: new Date()
        })
        res.status(200).json({message:"response processed",payload:request})
   
})


export {router as requestResponseRouter}