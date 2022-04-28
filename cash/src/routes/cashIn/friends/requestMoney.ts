import express, {Request,Response} from "express";
import { User } from "../../../models/user";
import { body } from 'express-validator';
import {  BadRequestError } from '@dstransaction/common';
import { NotificationCreatedPublisher } from "../../../events/publishers/notification-created-publisher";
import { natsWrapper } from "../../../nats-wrapper";
import { Friend } from "../../../models/request";
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
        const request=await Friend.create({
            userId:new mongoose.Types.ObjectId(req.body.userId),
            createdAt:new Date(),
            friendId :friend.id,
            amount:amount,
            expiresAt:expiration,
            deleted:false,
            status:"created",
        });
        await request.save();
        
        await new NotificationCreatedPublisher(natsWrapper.client).publish({
            id:friend._id,
            title:'Money Request',
            createdAt: new Date()
        });
        request.status="pending";
        await request.save()
        res.status(200).json({message:"request sent",payload:request})
})


export {router as requestMoneyRouter}