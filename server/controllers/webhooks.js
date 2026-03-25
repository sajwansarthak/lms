import {Webhook} from 'svix';
import User from '../models/user.js';

//API controller function to manage clerk user with database


export const clerkWebhooks = async (req,res) =>{
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //verify the headers
        await whook.verifyy(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const {data,type} = req.body

        switch(type){
            case 'user.created':{
                const userData = {
                    _id: data.id,
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                // adding the new data in our database
                await User.create(userData)
                res.JSON({})
                break;
            }

            case 'user.updated':{
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                // updating the data in the specific id in our database
                await User.findByIdAndUpdate(data.id,userData)
                res.JSON({})
                break;
            }

            case 'user.deleted':{
                await User.findByIdAndDelete(data.id,userData)
                res.JSON({})
                break;
            }

            default:
                break;
        }
    } catch(error){
        res.JSON({success: false,message: error.message})
    }
}
// now we'll go in server and route it