import express, {Request,Response} from "express";
import { BadRequestError } from '@dstransaction/common';
import { AgentCashIn } from "../../../models/request";


const router=express.Router();


router.get(
    '/api/cash/cashIn/getAgentTransaction',
    async(req:Request,res:Response)=>
    {
    try{
        const requests=await AgentCashIn.find({userId:req.body.userId})
        res.status(200).json(requests)
    }catch(err){
        console.log(err)
        throw new BadRequestError("internal server error")
    }
})


export {router as getcashInAgentTransactionRouter}