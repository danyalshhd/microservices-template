import express, {Request,Response} from 'express';
import { AgentCashOut } from '../../models/request';


const router=express.Router();

router.get('/api/cash/cashOut/getCashInAgentRequest',
async(req:Request,res:Response)=>{
    try{
        const requests= await AgentCashOut.find({userId:req.body.userId})
        res.status(200).json({results:{message:'OK',dataItems:requests}})
    }catch(err:any){
        throw new Error(err.message)
    }
    })


export {router as getCashInAgentRequestRouter}