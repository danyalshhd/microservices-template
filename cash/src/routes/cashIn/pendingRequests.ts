import express, { Request, Response } from "express";
import { Requests } from "../../models/request";


const router=express.Router()


router.get('/api/cash/pendingRequests',async(req:Request,res:Response)=>{
    const {userId}=req.body;
    const requests=await Requests.find({friendId:userId, status:"pending"});
    res.send(requests)
})


export {router as pendingRequestsRouter}