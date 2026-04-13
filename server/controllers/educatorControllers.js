import {clerkClient} from '@clerk/express'
import Course from '../models/course.js';
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from '../models/purchase.js';
import User from '../models/user.js';



//we will create a function to update the role to educator so that random user can become the educator after creating the function we have to create a route for it.
export const updateRoleToEducator = async (req,res) =>{
    try{
        // finding errors
        // console.log("AUTH OBJECT:", req.auth)
        // console.log("USER ID:", req.auth?.userId)
        //const authData = req.auth();
        //we will get the userid from the middleware we have created in server.js
        const userId = req.auth.userId

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

//Add New Course function

export const addCourse = async(req,res) =>{
    try{
        // We will get coursedata from request.body
        const {courseData} = req.body
        const imagefile = req.file
        //we will require educator id 
        const educatorId = req.auth.userId

        //checking if we have imagefile or not
        if(!imagefile){
            return res.json({success:false,message:'Thumbnail Not Attached'})
        }

        //Parsing courseData now we have complete course data along with educator id 
        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        // now we can store this data in database
        const newCourse = await Course.create(parsedCourseData)
        //Now we have added the course but not the image for that we have to upload the image in cloudinary to get the imageUrl 
        const imageUpload = await cloudinary.uploader.upload(imagefile.path)
        //Now in the imageUpload we will get a public url we will store it as imageUpload.secure_url and add it to our new course
        newCourse.courseThumbnail = imageUpload.secure_url
        //To Save new course to database
        await newCourse.save()

        res.json({success:true , message: 'Course Added'})
    }catch(error){
        res.json({success:false, message: error.message})
    }
}

//Get Educator Courses
export const getEducatorCourses = async(req,res) =>{
    try{
        const educator = req.auth.userId


        const courses = await Course.find({educator})
        res.json({success:true,courses})
    }catch(error){
        res.json({success:false, message: error.message})
    }
    //Now create a route for it in educatorRoutes.js
}


//Get Educator Dashboard Data (Total Earnings, Enrolled Students , No. of Courses)

export const getEducatorDashboardData = async (req,res) =>{
    try{
        const educator = req.auth.userId

        const courses = await Course.find({educator});
        //Finding Total number of courses
        const totalCourses = courses.length;
        //Getting course id of individual courses
        const courseIds = courses.map(course => course._id)
        //Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'Completed'
        })

        const totalEarnings = purchases.reduce((sum,purchase) => sum+purchase.amount,0)

        //Collect unique enrolled student ids with their course Title
        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            },'name imageUrl')

            students.forEach(student =>{
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }
        res.json({success:true, dashboardData: {
            totalCourses,enrolledStudentsData,totalEarnings
        }})
    }catch(error){
        res.json({success:false,message: error.message})
    }
}

//Get Enrolled Students data with puschased Data
export const getEnrolledStudentsData = async (req,res) =>{
    try{
        //fetch all courses by educator
        const educator = req.auth.userId
        const courses = await Course.find({educator});
        const courseIds = courses.map(course => course._id);

        //Now we find purchases with user and course data
        const purchases = await Purchase.find({
            courseId:{$in: courseIds},
            status: 'Completed'
        }).populate('userId','name imageUrl').populate('courseId','courseTitle')

        //Finding Student data
        const enrolledStudents= purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({success: true, enrolledStudents})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}