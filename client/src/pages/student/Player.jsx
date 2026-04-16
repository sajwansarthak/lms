import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AddContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import {toast} from 'react-toastify'
import axios from 'axios'
import Loading from '../../components/student/Loading'

function Player() {


  const {enrolledCourses,calculateChapterTime,backendUrl,getToken,userData,fetchUserEnrolledCourses} = useContext(AppContext)
  //use useParams to get courseid
  const {courseId} =useParams()
  //To get individual course data
  const [courseData,setCourseData] = useState(null)
  //function to get individual course data
  //const [completedLectures, setCompletedLectures] = useState(() => new Set())
  //Another state for playerData
  const [playerData,setPlayerData] =useState(null)
  // Another state variale for toggle function 
  const [openSection,setOpenSection] =useState({ })
  //
  const [progressData,setProgressData] = useState(null)
  //
  const [initialRating,setInitialRating] = useState(0)

  // useEffect(() =>{
  //   const found = enrolledCourses.find((course) => String(course._id) === String(courseId))
  //   setCourseData(found ?? null)
  // },[enrolledCourses, courseId])

  const getCourseData = () =>{
    if (!enrolledCourses || !courseId) return; // Guard against undefined


    enrolledCourses.forEach((course) =>{
      if(course._id === courseId){
        setCourseData(course)
        course.courseRating?.forEach((item) =>{
          if(item.userId === userData?._id){
            setInitialRating(item.rating)
          }
        })
      }

    })
  }

  //Toogle function 
  const toggleSection = ((index) => {
    setOpenSection((prev) => ({
        ...prev,
        [index] : !prev[index]
    }
    ))
  })
  useEffect(() => {
    fetchUserEnrolledCourses() // ✅ fetch fresh data on mount
    getCourseProgress()
  }, [])
  useEffect(() =>{
    if(enrolledCourses && enrolledCourses.length > 0){
      getCourseData()
    }
  },[enrolledCourses,userData])

  //Function to mark any Lecture completed
  const markLectureAsCompleted = async (lectureId) =>{
    try{
      const token = await getToken()
      const {data} =  await axios.post(backendUrl + '/api/user/update-course-progress',{courseId,lectureId},{headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        //whenever we are marking the lecture completed we are updating the courseProgress also 
        getCourseProgress()
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }
  //Function to give us Latest Data of Progress
  const getCourseProgress = async () =>{
    try{
      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/get-course-progress',{courseId},{headers:{Authorization: `Bearer ${token}`}})

      if(data.success){
        setProgressData(data.progressData)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }
  //Function to rate any course
  const handleRate = async (rating) =>{
    try{
      const token =await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/add-rating',{courseId,rating},{headers:{Authorization: `Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        await fetchUserEnrolledCourses() // fetches fresh data
        getCourseData()                  // ✅ re-reads rating from fresh data

      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }
  //YT Video fetching function 
  const getYouTubeId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    return match ? match[1] : null
  }
  useEffect(() =>{
    getCourseProgress()
        
  },[])


  return courseData ? (
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36 mb-2.5'>
      {/* Left Column */}
      <div className='text-gray-800'>
        <h2 className='text-xl font-semibold'>Course Structure</h2>

        {/* copying course structure form course details and modifying it a bit  */}
        <div className='pt-5'>
                {courseData && courseData.courseContent.map((chapter,index) => (
                    <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                        {/* adding toggel function  */}
                        <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                            <div className='flex items-center gap-2'>
                                {/* Adding a down arrow and chapter title */}
                                <img className={`transform transition-transform ${openSection[index] ? 'rotate-180':''}`}
                                 src={assets.down_arrow_icon} alt="arrow icon" />
                                <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                            </div>
                            {/* adding time  */}
                            <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                        </div>
                        {/* Now we will add lectures */}
                        

                        {/* Also adding togglefucntion here  */}
                        <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                            <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                                {chapter.chapterContent.map((lecture,i) =>(
                                    <li key={i} className='flex items-start gap-2 py-1'>
                                        {/* <img src={progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play icon" className='w-4 h-4 mt-1'/> */}
                                        <img src={progressData?.lectureCompleted?.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play icon" className='w-4 h-4 mt-1'/>
                                        {/* lecture title */}
                                        <div className='flex items-center justify-between w-full text-gray-800 text-sm md:text-default'>
                                            <p>{lecture.lectureTitle}</p>
                                            {/* Preview if that lecture is available for free Preview */}
                                            <div className='flex gap-2'>
                                                {/* adding functionality to preview button */}
                                                {lecture.lectureUrl && <p onClick={() => setPlayerData({
                                                  ...lecture, chapter: index + 1, lecture:i+1 
                                                })}
                                                className='text-blue-600 cursor-pointer'>Watch</p>}
                                                <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units:["h","m"]})}</p>
                                            </div>
                                        </div>
                                    </li>
                                ) )}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            {/* Adding option to rate so that use can rate the course */}
            <div className='flex items-center gap-2 py-3 mt-10'>
              <h1 className='text-xl font-semibold'>Rate this Course:</h1>
              {/* Updating rating from constant to whats in the backend */}
              <Rating initialRating={initialRating} onRate={handleRate}/>
            </div>
      </div>

      {/* Right Column */}
      <div className='md:mt-10'>
        {/* here when we have player data we will dispaly the div & if we dont have player data then we will display img thumbnai */}
        {playerData ? (
          //YouTube tag to play video 
          <div>
            <YouTube videoId={getYouTubeId(playerData.lectureUrl)} iframeClassName='w-full aspect-video' /> 
            <div className='flex justify-between items-center mt-1'>
              {/* Displaying chapter name lecture and title */}
              <p>{playerData.chapter}.{playerData.lecture}.{playerData.lectureTitle}</p>
              {/* button to mark if completed */}
              <button
                type="button"
                className='text-blue-600'
                onClick={() => markLectureAsCompleted(playerData.lectureId)}
              >
                {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed': 'Mark Complete'}
              </button>
            </div>
          </div>
        )
        :
        <img src={courseData ? courseData.courseThumbnail : null} alt="" />
        } 
      </div>
    </div>
    <Footer />
    </>
  ) : <Loading />
}

export default Player
