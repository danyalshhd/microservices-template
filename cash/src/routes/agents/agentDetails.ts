import express,{Request,Response} from 'express'
import { Agent } from '../../models/agent'


const router=express.Router()


router.get('/api/cash/agent-details',async(req:Request,res:Response)=>{
    try{

        const {agentId}=req.body
        const agent= await Agent.find({_id:agentId})
        res.status(200).json({results:{
            message:'OK',
            data:agent
        }})
    }catch(err:any){
        throw new Error(err)
    }
})


export {router as agentDetailsRouter}