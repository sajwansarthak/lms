//Middleware so that only educator can add course and no one else
import {clerkClient} from '@clerk/express'


//Middleware protect educator Routes
export const protectEducator = async (req,res,next) =>{
    try{
        const authdata = req.auth();
        const userId = authdata.userId
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
 