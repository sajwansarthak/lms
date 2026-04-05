//Here first we need the course model 
import Course from "../models/course.js"

//Controller function to return all Courses
export const getAllCourses = async (req,res) =>{
    try{
        // If any course is published then only we will display it on webpage we use populate educator so that we get all the educator details to display on our frontend
        const courses = await Course.find({isPublished: true}).select(['-courseContent','-enrolledStudents']).populate({path:'educator '})

        res.json({success: true, courses})
    }catch(error){
        res.json({success: false , message: error.message})
    }
}

