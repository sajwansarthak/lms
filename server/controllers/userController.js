import User from "../models/user.js"
import Course from "../models/course.js"
import { Purchase } from "../models/purchase.js"

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
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }
        //Added the purchase data now we have to add it to mongodb
        const newPurchase = await Purchase.create(purchaseData)

    }catch(error){

    }
}