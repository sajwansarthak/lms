import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    courseId:{type:mongoose.Schema.Types.ObjectId,
        ref:'Courses',
        required: true,
    },
    userId:{
        type: String,
        ref: 'User',
        required: true,
    },
    amount: {type:Number,required: true},
    status: {type:String, enum: ['Pending','Completed','Failed'],default: 'Pending'},

},{timestamps: true})

export const Purchase = mongoose.model('Purchase',purchaseSchema)