import  express, { Request, Response }  from "express";
import { User } from "../../models/user";
import { Requests } from "../../models/request";


const router= express.Router();


router.get('/api/cash/availableFriends',async(req:Request,res:Response)=>{
    const friends=await Requests.findOne({userId:req.body.userId}).select("friends");
    if(friends){
        const friend_list=friends.friends.filter((obj)=> !obj.deleted);
        res.status(200).json(friend_list)
    }
    else{
        res.status(200).json({message:"no friends exist"})
    }

})

export {router as availableFriendsRouter}