import {clerkClient} from '@clerk/express'



//we will create a function to update the role to educator so that random user can become the educator after creating the function we have to create a route for it.
export const updateRoleToEducator = async (req,res) =>{
    try{
        // finding errors
        // console.log("AUTH OBJECT:", req.auth)
        // console.log("USER ID:", req.auth?.userId)
        const authData = req.auth();
        //we will get the userid from the middleware we have created in server.js
        const userId = authData.userId

        // here we will use the clerkClient so first we will import it .
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role: 'educator',
            }
        })
        res.json({success: true, message: 'You can publish a course now'})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}