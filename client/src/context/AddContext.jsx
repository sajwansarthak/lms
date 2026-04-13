//This is used to create global state.
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import {useAuth,useUser} from '@clerk/clerk-react'
import axios from 'axios'
import {toast} from 'react-toastify'

//A global storage box that any component can access.
export const AppContext = createContext()

//It wraps your whole app and provides data to all child components.
export const AppContextProvider = (props) =>{

    //Creating State variable to get userdata from the api done after connect FE to BE
    const [userData,setUserData] = useState([])
    //Getting backend URL for axios connecting backend to frontend
    const backendUrl = import.meta.env.VITE_BACKEND_URL


    //Adding currency first we will declare it then we will add it in const value so it can be used anywhere
    const currency = import.meta.env.VITE_CURRENCY
    //Creating navigate function so when we click the site logo on navbar it navigate us to the home page
    const navigate = useNavigate()

    //Creating another state variable for the educator information
    const [isEducator,setIsEducator] = useState(false)
    //Cerating anothe state variable for the myEnrollement information 
    const [enrolledCourses,setEnrolledCourses] = useState([]) //now create a fun to get the user enrolled courses 

    //We will create a state variable to add data which we will use to display coursecards
    const [allCourses,setAllCourses] = useState([])
    //now to add data we have to create a function which can perform it 
    //fetch all courses
    const fetchAllCourses = async ()=>{
        //here we have to store data from assets file in the state defined above
        //setAllCourses(dummyCourses)
        //now pass allCourses in const value so it can be used anywhere in the project

        //After backend completed
        try{
            //provide backend url
            const {data} = await axios.get(backendUrl + '/api/course/all')

            if(data.success){
                setAllCourses(data.courses)
            }else{
                //Get react-toastify from its docs import it and get its container
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }
    //Getting auth token for authentication and clerk middlerware for the backend
    const {getToken} = useAuth()
    const {user} = useUser() //now we will create a useEffect for this 



    //Fucntion To Fetch UserData
    const fetchUserData = async () =>{


        if(user.publicMetadata.role === 'educator'){
            setIsEducator(true)
        }
        try{
            const token = await getToken()
            console.log("Token:", token)
            const {data} = await axios.get(backendUrl + '/api/user/data',{headers:{
                Authorization: `Bearer ${token}`
            }})

            if(data.success){
                setUserData(data.user)
                await fetchUserEnrolledCourses()
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    //Function to calculate average rating of course
    const calculateRating = (course) =>{
        //if the course has no rating 
        if(!course.courseRatings || course.courseRatings.length === 0 ){
            return 0;
        }
        //calculating the rating 
        let totalRating = 0 
        course.courseRatings.forEach(rating =>{
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }
    //Fucntion to Calculate course chapter time
    const calculateChapterTime = (chapter) =>{
        let time = 0 
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h","m"]})
    }
    //Function to Calculate Course Duration 
    const calculateCourseDuration = (course) => {
        if (!course?.courseContent) return "0h 0m";
        let time = 0
    
        course.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                time += lecture.lectureDuration
            })
        })
    
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }
    //Function to Calculate Total number of lectures in the course
    const calculateNoOfLectures = (course)=>{
        if (!course?.courseContent) return 0; // ✅ prevent crash
        let totalLectures = 0 
        course.courseContent.forEach(chapter =>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
        } );
        return totalLectures;
    }
    //Function to get the user Enrolled Courses
    const fetchUserEnrolledCourses = async () =>{
        //setEnrolledCourses(dummyCourses)
        //Now we will fetch userEnrolledCourses from the api
        try{
            const token = await getToken()
            const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses',{headers: {Authorization: `Bearer ${token}`}})

            //checking
            const allUsers = await User.find({}, { _id: 1 })
            console.log("DB userIds:", JSON.stringify(allUsers))

            if(data.success){
                //It will show new courses to the top
                setEnrolledCourses(data.enrolledCourses.reverse())
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

     //using the fetchAllCourses funtion we have created
     useEffect(() =>{
        fetchAllCourses()
        //We will remove this function from here and add it with fetchUserData because it will run when we get userData
        //fetchUserEnrolledCourses()
    },[])

    //function to diaplay token
    //we do not require this token now when we fetchUserData while connecting backednd to frontend
    // const logToken = async () =>{
    //     // this will display the token in frontend console
    //     console.log(await getToken())
    // }
    //useEffect to get auth token
    useEffect(() =>{
        if(user){
            //logToken()
            fetchUserData()
            //fetchUserEnrolledCourses()
        }
    },[user])

    
    //This is the data you want to share globally.
    const value = {
        currency,allCourses,navigate,calculateRating,isEducator,setIsEducator,calculateNoOfLectures,calculateCourseDuration,calculateChapterTime,enrolledCourses,fetchUserEnrolledCourses,backendUrl,userData,setUserData,getToken,fetchAllCourses
    }
    
    //	All components wrapped inside this provider
	//  Can access value

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}