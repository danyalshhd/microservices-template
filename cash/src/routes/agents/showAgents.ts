import express,{Request,Response} from 'express'
import { Agent } from '../../models/agent'


const router=express.Router()


router.get('/api/cash/agents',async(req:Request,res:Response)=>{
    try{

        const {town,parish}=req.body
        const agents= await Agent.find({'address.town':town, 'address.parish':parish})
        res.status(200).json({results:{
            message:'OK',
            dataItems:agents
        }})
    }catch(err:any){
        throw new Error(err)
    }
})


export {router as showAgentsRouter}