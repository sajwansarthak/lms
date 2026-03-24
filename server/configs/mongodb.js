//Here we will create function that will connect our project to mongodb
import mongoose from 'mongoose';

//COnnect to mongodb database;

const connectdb = async () =>{
    mongoose.connection.on('connected')
}