import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AddContext'
import Loading from '../../components/student/Loading'

const MyCourses =() => {
  // here we have to display all the courses by a particular educator therefore we need all the coursesdata which we will get from our context file
  const {currency,allCourses} = useContext(AppContext)
  // creating a state variable to get particular educator data
  const [courses,setCourses] =useState(null)
  // function to fetch all the courses and put it in setCourses
  const fetchAllCourses = async () =>{
    setCourses(allCourses)
  }
  useEffect(() =>{
    fetchAllCourses()
  },[])
  // we will only return when we have a course to display if no course display Loading component
  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 '>
      <div className='w-full'>
        {/* Adding title */}
        <h2 className='pb-4 text-lg font-medium'>My Courses</h2>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          {/* table to display courses created by educator */}
          <table className='md:table-auto table-fixed w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>
                <th className='px-4 py-3 font-semibold truncate'>Published On</th>
              </tr>
            </thead>
            {/* Here we will display course thumbnai name earning students enrolled and published on */}
            <tbody className='text-sm text-gray-500'>
              {courses.map((course) =>(
                <tr key={course._id} className='border-b border-gray-500/20'>
                  {/* adding course thumbnail and title in first table data */}
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                    <img src={course.courseThumbnail} alt="Course_Thumbnail" className='w-16'/>
                    <span className='truncate hidden md:block'>{course.courseTitle}</span>
                  </td>
                  {/* Earnings */}
                  <td className='px-4 py-3'>
                    {currency}{Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                  </td>
                  {/* Enrolled Students */}
                  <td className='px-4 py-3 '>
                    {course.enrolledStudents.length}
                  </td>
                  {/* Published On */}
                  <td className='px-4 py-3'>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default MyCourses