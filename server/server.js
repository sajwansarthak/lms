import express  from "express";
import cors from "cors";
import 'dotenv/config'


//Initializing Express
const app = express()

//Middleware 
// So that we can connect our backend with any other domian
app.use(cors())
app.use(express.json())

//Routes
//Default Route
app.get('/', (req,res) =>{
    res.json({
        message: "API Working",
    })
})

//Port 
const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})