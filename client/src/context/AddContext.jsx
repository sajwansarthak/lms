//This is used to create global state.
import { createContext, useEffect, useState } from "react";
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

        
        if(user?.publicMetadata?.role === 'educator'){
            setIsEducator(true)
        } else {
            setIsEducator(false)
        }
        try{
            const token = await getToken()
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
    const getCourseRatingsList = (course) =>
        course?.courseRating ?? course?.courseRatings ?? []

    const calculateRating = (course) =>{
        const ratings = getCourseRatingsList(course)
        if (!ratings.length) return 0
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0)
        return Math.floor(totalRating / ratings.length)
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
        try{
            const token = await getToken()
            const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses',{headers: {Authorization: `Bearer ${token}`}})

            if(data.success){
                const list = Array.isArray(data.enrolledCourses) ? data.enrolledCourses : []
                setEnrolledCourses([...list].reverse())
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
    },[])

    //useEffect to get auth token
    useEffect(() =>{
        if(user){
            fetchUserData()
        }
    },[user])

    
    //This is the data you want to share globally.
    const value = {
        currency,allCourses,navigate,calculateRating,getCourseRatingsList,isEducator,setIsEducator,calculateNoOfLectures,calculateCourseDuration,calculateChapterTime,enrolledCourses,fetchUserEnrolledCourses,backendUrl,userData,setUserData,getToken,fetchAllCourses
    }
    
    //	All components wrapped inside this provider
	//  Can access value

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}