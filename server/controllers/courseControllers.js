//Here first we need the course model 
import Course from "../models/course.js"

//Controller function to return all Courses
export const getAllCourses = async (req,res) =>{
    try{
        // If any course is published then only we will display it on webpage we use populate educator so that we get all the educator details to display on our frontend
        const courses = await Course.find({isPublished: true}).select(['-courseContent','-enrolledStudents']).populate({path:"educator"})

        res.json({success: true, courses})
    }catch(error){
        res.json({success: false , message: error.message})
    }
}

//Get Course by Id
export const getCourseById = async (req,res) =>{
    const {id} = req.params
    try{
        const courseData = await Course.findById(id).populate({path:"educator"})
        //Here we will get all the chapters and lectures of the individual course but from that we have to remove chapter url if preview is not free 
        //Remove lectureUrl if idPreview is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture =>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = "";
                }
            })
        })
        res.json({success:true , courseData})
    }catch(error){
        res.json({success:false ,message: error.message})
    }
}