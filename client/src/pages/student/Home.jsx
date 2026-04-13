import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CoursesSection from '../../components/student/CoursesSection'
import Tetimonials from '../../components/student/Tetimonials'
import Calltoaction from '../../components/student/Calltoaction'
import Footer from '../../components/student/Footer'


function Home() {
  return (
    <div className='flex flex-col min-h-screen space-y-7 items-center'>
      <Hero />
      <Companies />
      <CoursesSection />
      <Tetimonials />
      <Calltoaction />
      <Footer />
    </div>
  )
}

export default Home
