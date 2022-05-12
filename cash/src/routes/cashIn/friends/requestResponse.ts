import express, {Request,Response} from "express";
import {  BadRequestError, NotAuthorizedError, NotFoundError } from "@dstransaction/common";
import { NotificationCreatedPublisher } from "../../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../../nats-wrapper";
import { Friend } from "../../../models/request";
import mongoose from "mongoose";

const router=express.Router()

router.post('/api/cash/cashIn/requestResponse',async(req:Request,res:Response)=>{
        const {status,requestId,userId}=req.body
        //validating status
        if(!(status==="accepted" || status==="rejected")){
            throw new BadRequestError("Incorrect Status")
        }
        //validating request Id type
        if(!mongoose.isValidObjectId(requestId)){
            throw new BadRequestError("You did not enter a valid Request Id")
        }
        //validating request existence
        const request=await Friend.findById(requestId)
        if(!request){
            throw new BadRequestError("Request does not exist")
        }
        //checking if current user is authorized to access request
        if(userId!==request.friendId){
            throw new NotAuthorizedError()
        }



        // changing the request status
        request.status=status;
        await request.save();


        // sending the request response to requestor
        await new NotificationCreatedPublisher(natsWrapper.client).publish({
            id:(request.userId).toString(),
            title:'Money Request Response',
            createdAt: new Date()
        })
        res.status(200).json({message:"response processed",status:request.status})
   
})


export {router as requestResponseRouter}