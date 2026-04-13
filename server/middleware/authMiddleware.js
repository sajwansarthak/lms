//Middleware so that only educator can add course and no one else
import {clerkClient} from '@clerk/express'
import { getClerkUserId } from '../utils/clerkAuth.js'


//Middleware protect educator Routes
export const protectEducator = async (req,res,next) =>{
    try{
        const userId = getClerkUserId(req)
        //now using this userId we will check wheather the user in educator or not
        const response = await clerkClient.users.getUser(userId)

        if(response.publicMetadata.role !=='educator'){
            return res.json({ success:false, message: 'Unauthorized Access'})
        }

        next();
    }catch(error){
        res.json({success:false,message: error.message})
    }
}
 