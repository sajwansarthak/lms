import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'



//here will be the welcome content of the website the first page when you will open it.
function Hero() {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70'>
        {/* md:block hidden this means for medium screen and above that it will be block and below medium it will be hidden */}
      <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto pd-4'>Empower your future with the courses designed to <span className='text-blue-600'>fit your choice.</span><img src={assets.sketch} alt="sketch" className='md:block hidden absolute -bottom-7 right-11' /></h1>

      {/* It will be displayed on normal screen  */}
      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.</p>

      {/* It will be displayed on small screen */}
      <p className='md:hidden text-gray-500 max-w-sm mx-auto'>We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.</p>


      {/* Here we will import the searchbar */}
      <SearchBar />
    </div>

    //Now we will import it on student home.jsx in pages
  )
}

export default Hero
