import  express, { Request, Response }  from "express";
import { Requests } from "../../models/request";

const router= express.Router();

router.post('/api/cash/deleteFriend',async(req:Request,res:Response)=>{
    const {userId, friendId}=req.body
    const request =await Requests.findOneAndUpdate({userId:userId,"friends.friendId":friendId },
                                                    {$set:{"friends.$.deleted":true}},
                                                    {new:true,projection:{ friends:{'$elemMatch':{friendId:friendId}}}})
    res.status(200).json(request)

})

export {router as deleteFriendRouter}