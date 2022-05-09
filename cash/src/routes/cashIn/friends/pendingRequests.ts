import express, { Request, Response } from 'express';
import { Friend } from '../../../models/request';


const router=express.Router()


router.get('/api/cash/pendingRequests',async(req:Request,res:Response)=>{
    try{

        const {userId}=req.body;
        const requests=await Friend.find({friendId:userId, status:'pending'});
        res.status(200).json({results:{message:'OK',dataItems:requests}})
    }catch(err:any){
        throw new Error(err.message)
    }
})


export {router as pendingRequestsRouter}