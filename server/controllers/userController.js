import User from "../models/user.js"
import Course from "../models/course.js"
import { Purchase } from "../models/purchase.js"
import Stripe from 'stripe'
import { CourseProgress } from "../models/hostProgress.js"

//Here we will create a controller function to get userData
export const getUserData = async (req,res) =>{
    try{
        //verifying the user and finding user in db
        const authdata = req.auth()
        const userId = authdata.userId
        const user = await User.findById(userId)

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
//Users Enrolled Courses with Lecture Links
export const userEnrolledCourses = async (req,res) =>{
    try{
        const authdata = req.auth()
        const userId = authdata.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({success:true, enrolledCourses: userData.enrolledCourses})
    }catch(error){
        res.json({success:false, message: error.message})
    }
}
//Purchase Course

export const purchaseCourse = async (req,res) =>{
    try{
        const {courseId} = req.body
        const {origin} = req.headers 
        const authdata = req.auth()
        const userId = authdata.userId
        //Now using this userid we have to find userdata
        const userData = await User.findById(userId)
        //Getting CourseData
        const courseData = await Course.findById(courseId)

        //Checking if we have userdata and courseData available
        if(!userData || !courseData){
            return res.json({success:false, message: 'Data Not Found'})
        }

        //If we have both user and course data available then we will create purchaseData 
        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: Number((courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)),
        }
        //Added the purchase data now we have to add it to mongodb
        const newPurchase = await Purchase.create(purchaseData)

        //Stripe Gateway Initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        //Now we have to create Line Items where we have to store purchaseData product name amount
        const line_items = [{
            price_data:{
                currency,
                product_data:{
                    name: courseData.courseTitle
                },
                unit_amount: Number(Math.floor(newPurchase.amount) * 100)
            },
            quantity: 1 
        }]

        //Now using these line_items we will create payment sessions
        const session = await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({success:true, session_url: session.url})

    }catch(error){
        res.json({success:false, message: error.message})
    }
}

//Update User Course Progress
export const updateUserCourseProgress = async (req,res) =>{
    try{
        //Getting verified userId 
        const authdata = req.auth()
        const userId = authdata.userId
        //We will get the courseId and lectureId from the body 
        const {courseId,lectureId} =req.body

        //From courseProgressModel we have to find progressData
        const progressData = await CourseProgress.findOne({userId,courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: true,message: 'Lecture Already Completed'})
            }
            //If not completed then we have to put progress in db
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
            //if we dont have progressData then fo to else
        } else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId],
            })
        }
        res.json({success: true , message: 'Progress Updated'})

    }catch(error){
        res.json({success: false, message: error.message})
    }
} 
 