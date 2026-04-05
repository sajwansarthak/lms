import {Webhook} from 'svix';
import User from '../models/user.js';
import Stripe from 'stripe';
import { Purchase } from '../models/purchase.js';
import Course from '../models/course.js';


//API controller function to manage clerk user with database


export const clerkWebhooks = async (req,res) =>{
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //verify the headers
        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const {data,type} = req.body

        switch(type){
            case 'user.created':{
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                // adding the new data in our database
                await User.create(userData)
                res.json({})
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
                res.json({})
                break;
            }

            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

            default:
                break;
        }
    } catch(error){
        res.json({success: false,message: error.message})
    }
}
// now we'll go in server and route it


//Stripe Webhook

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ REQUIRED for Vercel (disable body parsing)
export const config = {
  api: {
    bodyParser: false,
  },
};

export const stripeWebhook = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    // ✅ get raw body (important for Stripe)
    const buf = await buffer(request);

    event = stripeInstance.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Webhook Error:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔥 Event received:", event.type);

  try {
    // ✅ Handle event
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object;

        const purchaseId = session.metadata.purchaseId;

        const purchaseData = await Purchase.findById(purchaseId);

        if (!purchaseData) {
          console.log("❌ Purchase not found");
          break;
        }

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        // ✅ enroll user
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        // ✅ update status
        purchaseData.status = "completed";
        await purchaseData.save();

        console.log("✅ Payment completed & enrolled");

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });

  } catch (error) {
    console.log("❌ Processing error:", error.message);
    response.status(500).json({ success: false, message: error.message });
  }
};

