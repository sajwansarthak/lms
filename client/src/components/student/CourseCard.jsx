import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AddContext'
import { Link } from 'react-router-dom'
import Rating from './Rating'

function CourseCard({course}) {


    const { currency,calculateRating,getCourseRatingsList } = useContext(AppContext)
    const ratingsList = getCourseRatingsList(course)

    const rating = ratingsList.length > 0 ? calculateRating(course) : 0


  return (
    //all the details course.courseThumbnail | course.courseTitle are in assets .. assets.js
    //instead of div we will use Link so when we click on a course card it will take us to that course
    <Link to={'/course/' + course._id} onClick={() => scrollTo(0,0)}
    className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg'>
        {/* course Thumbnail */}
      <img className='w-full ' src={course.courseThumbnail} alt="" />
      <div className='p-3 text-left'>
        {/* course Title */}
        <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
        {/* educator name */}
        {/* Displaying educator name from database done with backend connect  */}
        <p className='text-gray-500'>{course?.educator?.name || "Unknown Educator"}</p>
        {/* now we will create course rating - avg rating, stars out of 5, total rating */}
        <div className='flex item-center space-x-2'>
            {/* rating  using calculateRating function which we have created in AddContext so we can get clear rating of each course*/}
            <p>{rating}</p>
            {/* star rating  now according to the calculated rating we will display the stars*/}
            <div className='flex pt-1'>
                {[...Array(5)].map((_,i) => (<img className='w-3.5 h-3.5' key={i} src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt='' />) )}
            </div>
            {/* number of ratings */}
            <p className='text-gray-500'>{ratingsList.length}</p>
        </div>
        {/* course price for currency we will decalre it in .env file  */}
        <p className='text-base font-semibold text-gray-800'>{currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default CourseCard
