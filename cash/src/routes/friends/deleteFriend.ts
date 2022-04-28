import { BadRequestError, NotFoundError } from "@dstransaction/common";
import  express, { Request, Response }  from "express";
import mongoose from "mongoose";
import { Friend,  } from "../../models/request";

const router= express.Router();

router.post('/api/cash/deleteFriend',async(req:Request,res:Response)=>{
    const {userId, friendId}=req.body;
    if(!mongoose.isValidObjectId(friendId)){
        throw new BadRequestError("Invalid Friend Id")
    }
    const request=await Friend.findOne({userId:userId, friendId:friendId},{},{sort:{createdAt:"desc"}});
    if(!request){
        throw new BadRequestError("No Transaction History With User");
    }
    request.deleted=true;
    await request.save()
    res.status(200).json(request)

})

export {router as deleteFriendRouter}