import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

const Educator = ()=> {
  return (
    <div className='text-default min-h-screen bg-white'>
      {/* Mounting Educator navbar */}
      <Navbar />
      {/* Here nested element are used so we have to import and use outlet */}
      <div className='flex '>
        {/* Mounting Educator sidebar */}
        <Sidebar />
        {/* This will mount the educator side bar to the left and rest all things will take full space in the remaining part of the screen */}
        <div className='flex-1'>
          {<Outlet/>}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Educator
