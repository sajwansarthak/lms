import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AddContext'
import CourseCard from './CourseCard'

function CoursesSection() {

    //we have to get all the courses we have created in context file 
    const {allCourses} = useContext(AppContext)
  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800 flex justify-center'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3 text-center'>Discover our top-rated courses across various categories. From coding and design to <br /> business and wellness, our courses are crafted to deliver results.</p>


      {/* Adding 4 coursecard importing form coursecard.jsx */}
      {/* here we have created a custom class in index.css and used it here grid-cols-auto this make the course-cards responsive */}
      <div className='grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4'>
        {allCourses.slice(0,4).map((course,index) => <CourseCard key={index} course={course}/> )}
      </div>



      {/* Adding link to all courses page so when user click on show more courses he/she can be directed to all courses */}
      {/* onClick={() => scrollTo(0,0)} it scrolls the page to top */}
      {/* Use Link with capital letter because link is for html tag and Link is for react router components */}
      <div className='mt-6 flex justify-center'>
      <Link to={'/course-list'} onClick={() => scrollTo(0,0)}
      className='text-gray-500 border border-gray-500/30 px-14 py-3 rounded text-center'
      >Show all courses</Link>
      </div>
    </div>
  )
}

export default CoursesSection
