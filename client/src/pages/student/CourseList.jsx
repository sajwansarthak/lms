import React, { useContext, useMemo } from 'react'
import { AppContext } from '../../context/AddContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

function CourseList() {


    const {navigate, allCourses} = useContext(AppContext)
    const {input} = useParams()

    const filterCourse = useMemo(() => {
        if (!allCourses?.length) return []
        const tempCourses = allCourses.slice()
        if (!input) return tempCourses
        return tempCourses.filter((item) =>
            item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
    }, [allCourses, input])


  return (
    <>
    <div className='relative md:px-36 px-8 pt-20 text-left'>
        {/* In this div there will be heading and searchbar */}
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
            <div>
                {/* This is for the course list heading and home to redirect to home page */}
            <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
                <span className='text-blue-600 cursor-pointer' onClick={() => navigate('/')}>Home</span> / <span onClick={() => navigate('/course-list')} className='cursor-pointer'>Course List</span></p>
            </div>
                {/* Import the searchbar that we have already created */}
                {/* This is to get the data fromt the searchbar */}
                <SearchBar data={input}/>
        </div>
        {/* Adding function to remove filters */}
        {
            // This indicates that when we have input then only this div will get executed
            input && <div className='inline-flex item-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-600'>
                <p>{input}</p>
                <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={()=> navigate('/course-list')} />
            </div>

        }
        
        {/* Here we will add the course-cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 my-16 px-2 gap-3 md:p-0'>
            {filterCourse.map((course,index) => <CourseCard key={index} course={course}/> )}
        </div>
    </div>
    <Footer />
    </>
  )
}

export default CourseList
