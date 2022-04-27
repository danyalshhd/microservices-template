import  express, { Request, Response }  from "express";
import { User } from "../../models/user";
import { Requests } from "../../models/request";
import mongoose from "mongoose";


const router= express.Router();


router.get('/api/cash/availableFriends',async(req:Request,res:Response)=>{
    const friends=await Requests.aggregate([
        {
            $match:{userId:new mongoose.Types.ObjectId(req.body.userId)}
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $group:{
                _id:"$friendId",
                deleted:{$first:"$deleted"},
            }
        }
        
    ])
    const friends_list=friends.filter(e=>!e.deleted)
    res.status(200).json(friends_list)
})

export {router as availableFriendsRouter}