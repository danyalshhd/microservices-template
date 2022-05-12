import express, { Request, Response } from "express";
import { Friend } from "../../../models/request";


const router=express.Router()


router.get('/api/cash/allReceivedRequests',async(req:Request,res:Response)=>{
    const {userId}=req.body;
    const requests=await Friend.find({friendId:userId});
    res.send(requests)
})


export {router as receivedRequestsRouter}