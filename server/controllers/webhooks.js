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

export const stripeWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        // ✅ stripeInstance instead of Stripe
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`); // ✅ return added
    }

    console.log("🔥 Event received:", event.type);

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            await new Promise(resolve => setTimeout(resolve, 2000)); // ✅ wait for session to finalize

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });

            if (!session.data || session.data.length === 0) {
                console.log("⚠️ No session found");
                return response.json({ received: true });
            }

            const { purchaseId } = session.data[0].metadata;

            if (!purchaseId) {
                console.log("⚠️ No purchaseId in metadata");
                return response.json({ received: true });
            }

            const purchaseData = await Purchase.findById(purchaseId);
            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            courseData.enrolledStudents.push(userData);
            await courseData.save();

            userData.enrolledCourses.push(courseData._id);
            await userData.save();

            purchaseData.status = 'Completed';
            await purchaseData.save();

            console.log("✅ Payment completed & enrolled");
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });

            if (!session.data || session.data.length === 0) {
                console.log("⚠️ No session found");
                return response.json({ received: true });
            }

            const { purchaseId } = session.data[0].metadata;

            if (!purchaseId) return response.json({ received: true });

            const purchaseData = await Purchase.findById(purchaseId);
            purchaseData.status = 'Failed';
            await purchaseData.save();
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return response.json({ received: true });
}