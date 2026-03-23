import React, { useContext } from 'react'
import {assets} from '../../assets/assets'
import { Link } from 'react-router-dom'
// importing clerk for student login 
import { useClerk, UserButton, useUser  } from '@clerk/clerk-react'
import { AppContext } from '../../context/AddContext'

const Navbar = () => {

    //importing from addcontext.jsx
    const {navigate,isEducator,setIsEducator} = useContext(AppContext)
    //As we have different color of navbar for home page and course-page
    const isCourseListPage = location.pathname.includes('/course-list')

    const {openSignIn} = useClerk()
    const {user} = useUser()

  return (
    // px-4 sm:px-10 md:px-14 lg:px-36 different padding for different screen size
    //border-b = border bottom py- padding from y-axis
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-grey-500 py-4 ${isCourseListPage ? 'bg-white':'bg-cyan-100/70' }`}>
        {/* Adding logo */}
      <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />

      {/* it will be displayed on medium and large screen ex-laptop */}
      <div className='hidden md:flex items-center gap-5 text-grey-500'>
        <div className='flex items-center gap-5'>
            {/* now we will display links according to if user is loged in or not we will display diff links */}


            {/* This will be only displayed when the user is logged in . */}
            { user && 
            <>
                
                <button className='cursor-pointer' onClick={() =>{navigate('/educator')}}>{isEducator ? 'Educator Dashboard':'Become Educator'}</button> | <Link to='my-enrollments'>My Enrollments</Link>
            </>
            }
        </div>
        {/* when we have to signin or signout then we have to hide this button instead we will display users profile icon  */}

        { user ? <UserButton /> :
            //If user exists userButton will show user profile dropdown and if user does not exist then opensignIn will show create account button
            <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>}
      </div>
      {/* for phone screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
      <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>

            { user &&
            <>
                
                <button className='cursor-pointer' onClick={() => {navigate('/educator')}}>{isEducator ? 'Educator Dashboard':'Become Educator'}</button> | <Link to='my-enrollments'>My Enrollments</Link>
            </>
            }

        </div>
        { 
          user ? <UserButton /> : <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /></button>
        }
      </div>
    </div>
  )
}

export default Navbar
