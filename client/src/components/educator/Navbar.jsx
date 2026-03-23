import React from 'react'
//importing dummy data for educator for now 
import { assets, dummyEducatorData } from '../../assets/assets';
//importing from clerk for authentication
//UserButton is a prebuilt UI component that shows the logged-in user’s profile avatar.
//useUser is a React hook that gives you information about the currently logged-in user.
import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const educatorData = dummyEducatorData
  const {user} = useUser()

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border -b border-gray-500 py-3'>
      {/* whenever we click on logo it should redirect us to home page so we enclose the img inside Link tag from react router dom */}
      <Link to={'/'}>
        <img src={assets.logo} alt="logo" className='w-28 lg:w-32' />
      </Link>
      {/* displaying user name and if not logged in display developers  */}
      <div className='flex items-center gap-5 text-gray-500'>
        <p>Hi! {user ? user.fullName:'Developer'}</p>
        {/* displaying user profile icon */}
        {user ? <UserButton /> : <img className='max-w-8' src={assets.profile_img} />}
      </div>
    </div>
  )
}

export default Navbar
