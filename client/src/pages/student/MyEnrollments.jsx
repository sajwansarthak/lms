import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AddContext'
import {Line} from 'rc-progress'
import Footer from '../../components/student/footer'

//Using the package rc-progress which we have already downloaded we will display the progress bat but first we have to import it 

function MyEnrollments() {

  const {enrolledCourses,calculateCourseDuration,navigate} = useContext(AppContext)

  //Adding progress bar in the table
  const [progressArray,serProgressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 }
  ])
  return (
    <>
    <div className='md:px-36 px-8 pt-10'>
      <h1 className='text-2xl font-semibold'>My Enrollments</h1>
      <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10 mb-20'>
        {/* Creating Table Heading */}
        <thead className='text-gray-900 border border-gray-500/20 text-sm text-left max-sm:hidden'>
          <tr>
            <th className='px-4 py-3 font-semibold truncate'>Course</th>
            <th className='px-4 py-3 font-semibold truncate'>Duration</th>
            <th className='px-4 py-3 font-semibold truncate'>Completed</th>
            <th className='px-4 py-3 font-semibold truncate'>Status</th>
          </tr>
        </thead>
        {/* Creating table body */}



        <tbody className='text-gray-700'>
          {/* getting user enrolled courses */}
          {enrolledCourses.map((course,index) =>(
          <tr key={index} className='border border-gray-500/20'>
            {/* Adding thumbnail and coursetitle  */}
            <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
              <img src={course.courseThumbnail} alt=""  className='w-14 sm:w-24 md:w-28'/>
              <div className='flex-1'>
                 <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                 {/* Adding the progress bar according to the lectures completed*/}
                 <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures : 0 } className='bg-gray-300 rounded-full'></Line>
              </div>
            </td>
            {/* Displaying Course Duration */}
            <td className='px-4 py-3 max-sm:hidden'>
              {calculateCourseDuration(course)}
            </td>
            {/* Displaying how many lectures are completed out of total  */}
            <td className='px-3 py-3 max-sm:hidden'>
              {/* Here we will display the progress bar */}
              {progressArray[index] && `${progressArray[index].lectureCompleted} /${progressArray[index].totalLectures}`} <span>Lectures</span>
            </td>
            {/* Displaying is lectures are completed or are on going */}
            <td className='px-4 py-3 max-sm:text-right'>
              <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-sm text-white border rounded' onClick={() => navigate('/player/' + course._id)}>
                {/* displaying complete instead of On Going if all lectures are done  */}
                {
                  progressArray[index] && progressArray[index].lectureCompleted /progressArray[index].totalLectures === 1 ? 'Completed':'On Going'
                }
                </button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Footer />
    </>
  )
}

export default MyEnrollments
