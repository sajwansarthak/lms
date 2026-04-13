import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AddContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
// importing yt package to play youtube video
import YouTube from 'react-youtube'

function CourseDetails() {

    // To get/store the course id
    const {id} = useParams()
    // State variable to store course data
    const [courseData,setCourseData] = useState(null)
    //state variable for opening and closing lectures dropdown in course structure section 
    const [openSection,setOpenSection] = useState({})
    //Creating another state variable for the enroll button in right column coursecard
    //Making state variable for preview to work so when user click on preview the lesson preview can be seen in right colum coursecard thumbnail
    const [playerData,setPlayerData] = useState(null)
    //Using id we will find a particular course in all courses
    const {allCourses,calculateRating,getCourseRatingsList,calculateNoOfLectures,calculateCourseDuration,calculateChapterTime,currency,enrolledCourses} = useContext(AppContext)

    //Function to fetch individual course data
    const fetchCourseData = async () => {
        const findCourse = allCourses.find(course => String(course._id) === String(id))
        //here we use setter function to set the findcourse value in coursedata
        setCourseData(findCourse)
    }
    // to execute fetchCourseData function whenever it mounts we will useEffect hook
    useEffect(() =>{
        fetchCourseData()
    },[allCourses, id])

    //Creating toggle function to open and close course chapter lectures section 
    const toggleSection = ((index) => {
        setOpenSection((prev) => ({
            ...prev,
            [index] : !prev[index]
        }
        ))
    })



  const isEnrolled = courseData && enrolledCourses.some((c) => String(c._id) === String(courseData._id))
  const ratingsList = courseData ? getCourseRatingsList(courseData) : []

  return courseData ? (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
      {/* to add gradient color */}
      <div className='absolute top-0 left-0 w-full section-height bg-gradient-to-b from-cyan-100/70'>

      </div>
      {/* here we have to create two columns */}

      {/* Left Column */}
      <div className='max-w-xl z-10 text-gray-500'>
        {/* displaying course title */}
        <h1 className='md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800'>{courseData.courseTitle}</h1>
        {/* displaying course description and hiding html tags*/}
        <p className='pt-4 md:text-base text-sm'
        dangerouslySetInnerHTML={{__html: courseData.courseDescription.slice(0,200)}}></p>

        {/* adding review and rating form coursecard.jsx */}
        {/* now we will create course rating - avg rating, stars out of 5, total rating */}
        <div className='flex item-center space-x-2 pt-3 pb-2 text-sm'>
            {/* rating  using calculateRating function which we have created in AddContext so we can get clear rating of each course*/}
            <p>{calculateRating(courseData)}</p>
            {/* star rating  now according to the calculated rating we will display the stars*/}
            <div className='flex pt-1'>
                {[...Array(5)].map((_,i) => (<img className='w-3.5 h-3.5' key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' />) )}
            </div>
            {/* number of ratings and adding text after numeric rating*/}
            <p className='text-blue-600'>({ratingsList.length} {ratingsList.length !== 1 ? 'ratings':'rating'})</p>

            {/* total number of enrolled students */}
            <p>{courseData?.enrolledStudents?.length} {courseData?.enrolledStudents?.length > 1 ? 'students':'student'}</p>
        </div>
        {/* Author Name */}
        <p className='text-sm '>Course by <span className='text-blue-600 underline'>Learnify</span></p>

        {/* course structure duration and content of the course */}
        <div className='pt-8 text-gray-800'>
            {/* Course structure heading */}
            <h2 className='text-xl font-semibold'>Course Structure</h2>

            <div className='pt-5'>
                {courseData?.courseContent?.map((chapter,index) => (
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
                                        <img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1'/>
                                        {/* lecture title */}
                                        <div className='flex items-center justify-between w-full text-gray-800 text-sm md:text-default'>
                                            <p>{lecture.lectureTitle}</p>
                                            {/* Preview if that lecture is available for free Preview */}
                                            <div className='flex gap-2'>
                                                {/* adding functionality to preview button */}
                                                {lecture.isPreviewFree && <p onClick={() => setPlayerData({
                                                    videoId: lecture.lectureUrl.split('/').pop()
                                                })}
                                                className='text-blue-600 cursor-pointer'>Preview</p>}
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
            {/* Displaying course description */}
            <div className='py-20 text-sm md:text-default'>
                <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
                <p className='pt-3 md:text-base text-sm rich-text' 
                dangerouslySetInnerHTML={{__html: courseData.courseDescription}}></p>
            </div>
        </div>

      </div>
      {/* Right Column */}
      <div className='max-w-course-card z-10 rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
         {/* Replacing the thumbnail with video when user want's to see preview */}

            {
                // To play the youtube video we have to import the react-youtube package that we have Already installed 
                playerData ? 

                <YouTube videoId={playerData.videoId} opts={{playerVars: {autoplay: 1}}} iframeClassName='w-full aspect-vedio'/>
                :<img src={courseData.courseThumbnail} alt="" />
            }

        <div className='p-5'>
            <div className='flex item-center gap-2'>
                <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock icon" />
                <p className='text-red-500'><span className='font-medium'>5 days</span>left at this price</p>
            </div>
            {/* Course Price */}
            <div className='flex gap-3 items-center pt-2'>
                {/* Price with discount */}
                <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency} {(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                {/* General price without discout */}
                <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
                {/* Adding percentage of discout */}
                <p className='md:text-large text-gray-500'>{courseData.discount}% off</p>
            </div>

            {/* Adding course rating duration and number of lectures */}
            <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
                {/* Course rating */}
                <div className='flex items-center gap-1'>
                    {/* star icon */}
                    <img src={assets.star} alt="star" />
                    {/* course average rating */}
                    <p>{calculateRating(courseData)}</p>
                </div>
                {/* adding vertical line  */}
                <div className='h-5 w-px bg-gray-500/40'></div>

                {/* Adding course duration */}
                <div className='flex items-center gap-1'>
                    <img src={assets.time_clock_icon} alt="time clock icon" />
                    <p>{ courseData?calculateCourseDuration(courseData):"Loading..."}</p>
                </div>
                {/* Adding vertical line */}
                <div className='h-4 w-px bg-gray-500/40'></div>

                {/* Adding total number of lectures */}
                <div className='flex items-center gap-1'>
                    <img src={assets.lesson_icon} alt="lesson ison" />
                    <p>{courseData ? calculateNoOfLectures(courseData):0} Lessons</p>
                </div>

            </div>
            <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>{isEnrolled ? 'Already Enrolled':'Enroll Now'}</button>
            {/* Adding little bit more course details */}
            <div className='pt-6'>
                <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course ?</p>
                <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                    <li>Lifetime access with free updates.</li>
                    <li>Step-by-step, hands-on project guidance.</li>
                    <li>Downloadable resources and source code.</li>
                    <li>Quizzes to test your knowledge.</li>
                    <li>Certificate of completion.</li>
                    <li>Quizzes to test your knowledge.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
    {/* Adding footer  */}
    <Footer />
    </>
  ) : <Loading />
}

export default CourseDetails
