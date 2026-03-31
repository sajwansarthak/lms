import mongoose from 'mongoose'



//Schema for Lecture
const lectureSchema = new mongoose.Schema({
    lectureId: {type:String, required: true},
    lectureTitle: {type:String, required: true},
    lectureDuration: {type:Number, required: true},
    lectureUrl: {type:String, required: true},
    isPreviewFree: {type:Boolean, required: true},
    lectureOrder: {type:Number, required: true}
},{_id: false});


//Schema for courseContent
const chapterSchema = new mongoose.Schema({
    chapterId: {type:String, required: true},
    chapterOrder: {type:String, required: true},
    chapterTitle: {type:String, required: true},
    chapterContent: [lectureSchema]
    // id will be false because we are already providing unique id from our frontend
},{_id:false});

const courseSchema = new mongoose.Schema({
    courseTitle:{ type: String, required: true},
    courseDescription:{ type: String, required: true},
    courseThumbnail:{type:String},
    coursePrice:{ type:Number, required: true},
    isPublished:{ type:Boolean, required: true},
    discount:{ type:Number, required: true , min: 0,max: 100},
    //for courseContent we will define another schema
    courseContent: [chapterSchema],
    courseRating:[
        {userId: {type:String}, rating:{type: Number,min:1,max:5}}
    ],
    educator:{type: String,ref:'User',required: true},
    // enrolled student data
    enrolledStudents:[
        {type:String,ref:'User'}
    ],
    //minimize false means if we dont provide any value for courserating enrolledstudent then it will create these values.
},{timestamps: true, minimize: false});

// Now using this Schema we will create our courseModel 
//In educatorController create add course function
const Course = mongoose.model('Course',courseSchema)


export default Course