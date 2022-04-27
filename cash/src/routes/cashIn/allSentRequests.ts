import express, { Request, Response } from "express";
import { Requests } from "../../models/request";


const router=express.Router()


router.get('/api/cash/allSentRequests',async(req:Request,res:Response)=>{
    const {userId}=req.body;
    const requests=await Requests.find({userId:userId});
    res.send(requests)
})


export {router as sentRequestsRouter}