import { BadRequestError, RequestValidationError } from '@dstransaction/common'
import express,{Request,Response} from 'express'
import { Agent } from '../../models/agent'


const router=express.Router()


router.get('/api/cash/agents-parish',async(req:Request,res:Response)=>{
    const {parish}=req.body
    try{
        if(!parish){
            const parishes=await Agent.find({},{'address.parish':1}).distinct('address.parish')
            res.status(200).json({results:{
                message:'OK',
                dataItems:parishes
            }})
        }else{
            const regex=new RegExp(parish,'i')
            const parishes=await Agent.find({'address.parish':{$regex:regex}},{'address.parish':1}).distinct('address.parish')
            res.status(200).json({results:{
                message:'OK',
                dataItems:parishes
            }})
        }
    }catch(err:any){
        throw new Error(err.message)      
    }
})


export {router as showparishsRouter}