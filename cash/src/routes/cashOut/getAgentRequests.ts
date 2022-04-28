import express, {Request,Response} from "express";
import { BadRequestError } from '@dstransaction/common';
import { AgentCashOut } from "../../models/request";


const router=express.Router();

router.get('/api/cash/cashOut/getCashInAgentRequest',
async(req:Request,res:Response)=>{
    try{
        const request= await AgentCashOut.find({userId:req.body.userId})
        res.status(200).json(request)
    }catch(err){
        console.log(err)
        throw new BadRequestError('internal server error')
    }
    })


export {router as getCashInAgentRequestRouter}