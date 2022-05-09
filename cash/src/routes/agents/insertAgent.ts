import express,{Request,Response} from 'express'
import mongoose from 'mongoose'
import { Agent } from '../../models/agent'


const router=express.Router()


router.post('/api/cash/add-agents',async(req:Request,res:Response)=>{
    try{

        const {town,parish,name,bid,aid,}=req.body
        const agent=await Agent.create({
            agentId:aid,
            bankId:bid,
            agentName:name,
            address:{town,parish},
            
        })
        await (agent.save())
        res.status(200).json({results:{
            message:'SUCCESS'
        }})
    }catch(err:any){
        throw new Error(err.message)
    }
    })


export {router as storeAgentsRouter}