import  express, { Request, Response }  from 'express';
import { User } from '../../models/user';
import { Requests } from '../../models/request';
import mongoose from 'mongoose';


const router= express.Router();


router.get('/api/cash/availableFriends',async(req:Request,res:Response)=>{
    try{

        const friends=await Requests.aggregate([
            {
                $match:{userId:(req.body.userId)}
            },
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $group:{
                    _id:'$friendId',
                    deleted:{$first:'$deleted'},
                }
            }
            
        ])
        const friends_list=friends.filter(e=>!e.deleted)
        res.status(200).json({results:{message:'OK',dataItems:friends_list}})
    }catch(err:any){
        throw new Error(err.message)
    }
    })
    
export {router as availableFriendsRouter}