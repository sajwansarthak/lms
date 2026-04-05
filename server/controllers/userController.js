import User from "../models/user.js"

//Here we will create a controller function to get userData
export const getUserData = async (req,res) =>{
    try{
        //verifying the user and finding user in db
        const authdata = req.auth()
        const userId = authdata.userId
        const user = await User.findById({userId})

        //Response if we don't have the user
        if(!user){
            return res.json({success:false, message:'User Not Found'})
        }
        //Response if we have the User
        res.json({success:true , user})
    }catch(error){
        res.json({success:false , message: error.message})
    }
}
