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
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)


export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':{
       const paymentIntent = event.data.object;
       const paymentIntentId = paymentIntent.id

      //puchase Session 
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })
      //Now from this session we will extract purchaseId
      const {purchaseId} = session.data[0].metadata;
      //Now using this purchaseId we will find purchaseData 
      const purchaseData = await Purchase.findById(purchaseId)
      //Now we will find userData using the purchaseData
      const userData = await User.findById(purchaseData.userId)
      //Now we will find courseData using purchaseData
      const courseData = await Course.findById(purchaseData.courseId.toString())

      //Now we have to add the userData in courseData and courseData in userData
      courseData.enrolledStudents.push(userData) //now saving it in mongodb
      await courseData.save()
      userData.enrolledCourses.push(courseData._id)
      await userData.save()

      //changing purchase status
      purchaseData.status = 'Completed'
      await purchaseData.save()

      break;}
    case 'payment_intent.payment_failed':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id

      //puchase Session 
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })
      //Now from this session we will extract purchaseId
      const {purchaseId} = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId)
      //Now we will update the purchase status to failed 
      purchaseData.status ='Failed'
      await purchaseData.save()
      break;}
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}
 