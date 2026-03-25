import mongoose from 'mongoose';
import { type } from 'os';


//User Schema
const userSchema = new mongoose.Schema(
    {
        _id: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true},
        imageUrl: {type: String, required: true},
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
    }, {timestamps: true}
)

//User Model