import React from 'react'
import { assets } from '../../assets/assets'

function Footer() {
  return (
    <footer className='bg-gray-900 w-full px-6 md:px-16 lg:px-24 pb-3 flex-1'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-between gap-10 py-10 border-b border-white/30'>
        
        {/* Column 1: Logo + description */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <img src={assets.logo_dark} alt="logo" />
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>

        {/* Column 2: Company links */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>

        {/* Column 3: Newsletter (hidden on mobile) */}
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className='flex items-center gap-2 pt-4'>
            <input
              type="email"
              placeholder='Enter your email'
              className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'
            />
            <button className='text-white bg-blue-600 w-24 h-9 rounded'>Subscribe</button>
          </div>
        </div>
      </div>

      <p className='text-white/80 text-center mt-2 text-xs md:text-sm'>
        Copyright 2026 &copy; Learnify. All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer
