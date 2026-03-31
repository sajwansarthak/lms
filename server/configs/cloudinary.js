import {v2 as cloudinary} from 'cloudinary'

//Function to connect to cloudinary
const connectCloudinary = async () => {
    //here we have to provide keys
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    })
}

// now export the function and call it in server.js
export default connectCloudinary