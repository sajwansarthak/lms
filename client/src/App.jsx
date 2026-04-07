import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CourseList from './pages/student/CourseList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import AddCourse from './pages/educator/AddCourse'
import Dashboard from './pages/educator/Dashboard'
import MyCourses from './pages/educator/MyCourses'
import StuEnrolled from './pages/educator/StuEnrolled'
import Navbar from './components/student/navbar'
//importing toast container To get success or fail response notification after api call 
import {ToastContainer} from 'react-toastify'
//imporitng quilljs with snow theme got it from quilljs documentation
import "quill/dist/quill.snow.css";





const App = () => {

  const isEducatorRoute = useMatch('/educator/*')

  return (
    <div className='text-default bg-white min-h-screen'>
      {/* Adding toast container so that we can use it throughout the project */}
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}
      <Routes>
        {/* Students */}
        <Route path='/' element={<Home />}/>
        <Route path='/course-list' element={<CourseList />} />
        {/* here based on the input keyword we will display the filtered course-list */}
        <Route path='/course-list/:input' element={<CourseList />} />
        {/* course-page will be a dynamic route because we have to display different courses */}
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='loading/:path' element={<Loading />} />
        
        {/* Educator */}
        <Route path='/educator' element={<Educator/>}>

          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StuEnrolled />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
