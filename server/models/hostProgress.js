import mongoose from 'mongoose'

const courseProgressSchema = new mongoose.Schema({
    userId:{type: String,required: true},
    courseId:{type: String, required: true},
    completed:{type: Boolean, default: false},
    //To store the list of lectures the user has completed
    lectureCompleted:[]
},{minimize: false})

export const CourseProgress = mongoose.model('CourseProgress',courseProgressSchema)