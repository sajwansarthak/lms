import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AddContext';
import { NavLink } from 'react-router-dom';

const Sidebar =() => {

  // To check wheather it is the educator or not
  const {isEducator} = useContext(AppContext)
   

  // Adding links to different elements in the sidebar
  const menuItems =[
    {name: 'Dashboard',path: '/educator',icon: assets.home_icon},
    {name: 'Add Course',path: '/educator/add-course',icon: assets.add_icon},
    {name: 'My Courses',path: '/educator/my-courses',icon: assets.my_course_icon},
    {name: 'Student Enrolled',path: '/educator/student-enrolled',icon:assets.person_tick_icon},
  ];
  //Return this only if isEducator is true
  return isEducator && (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
      {menuItems.map((item) =>(
        // use NavLink from react router dom 
        // In this we will display the menuItemsa
        <NavLink 
        to={item.path}
        key={item.name}
        end={item.path === '/educator'}
        // here whenever you click on a menu link it will be active so it will have diff className and when inactive it will have different classnames
        className={({isActive}) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' :'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'} `}>
          <img src={item.icon} alt="" className='w-6 h-6'/>
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
