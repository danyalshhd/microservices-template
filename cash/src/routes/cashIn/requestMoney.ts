import express, {Request,Response} from "express";
import { User } from "../../models/user";
import { body } from 'express-validator';
import {  BadRequestError } from '@dstransaction/common';
import { NotificationCreatedPublisher } from "../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { Requests } from "../../models/request";
import mongoose from "mongoose";

const router=express.Router()
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
    '/api/cash/cashIn/request',
    [
        body('email').isEmail().withMessage('Email must be valid')
    ],
    async(req:Request,res:Response)=>{


        const {email,amount}=req.body
        //checking if friend exists 
        const friend=await User.findOne({email:email})
        if(!friend){
            throw new BadRequestError("Friend not found")
        }
        //throwing error if sending money to self
        if(friend.id===req.body.userId){
            throw new BadRequestError("Cannot send money to self")
        }
        //setting expiration date
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
        //new request object
        const request={
            id:new mongoose.Types.ObjectId(),
            friendId :friend.id,
            fullname:friend.id,
            amount:amount,
            expiresAt:expiration,
            status:"created",
            createdAt:new Date(),
        }
        //checking if user has any request history
        const user_requests=await Requests.findOne({userId:req.body.userId});
        if(!user_requests){ //if no history then we create a new user history in collection
            const user_requests=Requests.build({
                userId:req.body.userId,
                friends:[{
                    friendId:friend.id,
                    fullname:friend.id,
                    lastRequestAmount:amount,
                    createdAt:new Date(),
                    deleted:false
                }],
                requests:[
                    {
                        ...request
                    }
                ]
                
            })
            user_requests.save()
        }
        else{// else we push the request object in history
            user_requests.requests.push(request);
            const index=user_requests.friends.findIndex(e=>e.friendId===friend.id);
            if(index!==-1){
                user_requests.friends[index].createdAt=new Date();
                user_requests.friends[index].lastRequestAmount=amount;
                user_requests.friends[index].deleted=false;
                
            }
            else{
                user_requests.friends.push({
                    friendId:friend.id,
                    fullname:friend.id,
                    lastRequestAmount:amount,
                    createdAt:new Date(),
                    deleted:false
                })
            }
            user_requests.save()
        }
        
        await new NotificationCreatedPublisher(natsWrapper.client).publish({
            id:friend._id,
            title:'Money Request',
            createdAt: new Date()
        })
        res.status(200).json({message:"request sent",payload:request})
})


export {router as requestMoneyRouter}