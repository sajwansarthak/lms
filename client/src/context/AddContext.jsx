//This is used to create global state.
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'

//A global storage box that any component can access.
export const AppContext = createContext()

//It wraps your whole app and provides data to all child components.
export const AppContextProvider = (props) =>{


    //Adding currency first we will declare it then we will add it in const value so it can be used anywhere
    const currency = import.meta.env.VITE_CURRENCY
    //Creating navigate function so when we click the site logo on navbar it navigate us to the home page
    const navigate = useNavigate()

    //Creating another state variable for the educator information
    const [isEducator,setIsEducator] = useState(true)
    //Cerating anothe state variable for the myEnrollement information 
    const [enrolledCourses,setEnrolledCourses] = useState([]) //now create a fun to get the user enrolled courses 

    //We will create a state variable to add data which we will use to display coursecards
    const [allCourses,setAllCourses] = useState([])
    //now to add data we have to create a function which can perform it 
    //fetch all courses
    const fetchAllCourses = async ()=>{
        //here we have to store data from assets file in the state defined above
        setAllCourses(dummyCourses)
        //now pass allCourses in const value so it can be used anywhere in the project
    }

    //Function to calculate average rating of course
    const calculateRating = (course) =>{
        //if the course has no rating 
        if(course.courseRatings.length === 0 ){
            return 0;
        }
        //calculating the rating 
        let totalRating = 0 
        course.courseRatings.forEach(rating =>{
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }
    //Fucntion to Calculate course chapter time
    const calculateChapterTime = (chapter) =>{
        let time = 0 
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h","m"]})
    }
    //Function to Calculate Course Duration 
    const calculateCourseDuration = (course) => {
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
        setEnrolledCourses(dummyCourses)
    }

     //using the fetchAllCourses funtion we have created
     useEffect(() =>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])

    
    //This is the data you want to share globally.
    const value = {
        currency,allCourses,navigate,calculateRating,isEducator,setIsEducator,calculateNoOfLectures,calculateCourseDuration,calculateChapterTime,enrolledCourses,fetchUserEnrolledCourses
    }
    
    //	All components wrapped inside this provider
	//  Can access value

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}