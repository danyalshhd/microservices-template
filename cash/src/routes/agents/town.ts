import { BadRequestError } from '@dstransaction/common'
import express,{Request,Response} from 'express'
import { Agent } from '../../models/agent'


const router=express.Router()


router.get('/api/cash/agents-town',async(req:Request,res:Response)=>{
    const {town}=req.body
    try{
        if(!town){
            const towns=await Agent.find({},{'address.town':1}).distinct('address.town')
            res.status(200).json({results:{
                message:'OK',
                dataItems:towns
            }})
                }
                
        else{
            const regex=new RegExp(town,'i')
            const towns=await Agent.find({'address.town':{$regex:regex}},{'address.town':1}).distinct('address.town')
            res.status(200).json({results:{
                message:'OK',
                dataItems:towns
            }})
        }
    }catch(err:any){
        throw new Error(err.message)
    }
})


export {router as showtownsRouter}