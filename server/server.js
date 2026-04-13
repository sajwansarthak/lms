import 'dotenv/config'
import express  from "express";
import cors from "cors";
import connectdb from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import {clerkMiddleware} from '@clerk/express'
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";


//Initializing Express
const app = express()

//Connect to database
await connectdb()
//Connect to Cloudinary
await connectCloudinary()

//Middleware 
// So that we can connect our backend with any other domian
app.use(cors())
//using clerk middleware to get auth so we can use it to get userid for other routes to test this api we need auth token to get it we have to go to client->src->context->appcontext.jsx
app.use(clerkMiddleware())

//Routes
//Default Route
app.get('/',express.json(), (req,res) =>{
    res.json({
        message: "API Working",
    })
})
//clerkwebhook Route;
app.post('/clerk', express.json(), clerkWebhooks)
//Educator Route from routes => educatorRoutes
app.use('/api/educator',express.json(), educatorRouter)
//Course Route
app.use('/api/course',express.json(),courseRouter)
//User Router
app.use('/api/user',express.json(),userRouter)
//Stripe 
app.post('/stripe',express.raw({type: 'application/json'}),stripeWebhooks)
//Port 
const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})