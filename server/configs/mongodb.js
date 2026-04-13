//Here we will create function that will connect our project to mongodb
import mongoose from 'mongoose';

//COnnect to mongodb database;

const connectdb = async () =>{
    mongoose.connection.on('connected',() => console.log('Database Connected'))

    // connecting to our database ggetting it from environment variable .env and /adding our project name for db
    await mongoose.connect(`${process.env.MONGODB_URL}/lms`)
}
// exporting it so that it can be used anywhere in the project
// Now we need to call this function in our server file so that whenever we start the server db connects automaticallexport default connectdb
export default connectdb