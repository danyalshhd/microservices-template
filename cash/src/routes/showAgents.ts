import express,{Request,Response} from "express"



const router=express.Router()


router.get('/api/cash/agents',async(req:Request,res:Response)=>{
    const {town,parish}=req.body
    console.log('sdgsdgs')
    //fetch agents list from microservice
    res.status(200).json({message:`agents list from ${town} town & ${parish} parish`})
})


export {router as showAgentsRouter}