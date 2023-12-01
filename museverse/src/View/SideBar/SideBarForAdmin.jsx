import React from 'react'
import { RxDashboard } from "react-icons/rx";
import logo from '../../assets/MuseverseMain.png'
import { FaRegUser } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { NavLink, useNavigate } from 'react-router-dom';

function SideBarForAdmin() {

    const navigate = useNavigate()
    const changeRoute = () =>{ 
        let path = `/`; 
        navigate(path);
      }

  return (
    <div className='md:flex flex-col h-screen py-6 px-4 bg-[#121212] overflow-y-scroll w-[240px] transition-all overflow-hidden'>
            <img src={logo} onClick={changeRoute} className={`transition-all cursor-pointer`}></img>

            <NavLink to={`/`} className='flex flex-row gap-2'>
                <RxDashboard className='text-white'/>
                <p className='text-white'>Dashboard</p>
            </NavLink>

            <NavLink to={`/distributors`} className='flex flex-row gap-2'>
                <FaRegUser className='text-white'/>
                <p className='text-white'>Distributors</p>
            </NavLink>

            <NavLink to={`/users`} className='flex flex-row gap-2'>
                <FaRegUser className='text-white'/>
                <p className='text-white'>Users</p>
            </NavLink>

            <NavLink to={`/report`} className='flex flex-row gap-2'>
                <TbReportAnalytics className='text-white'/>
                <p className='text-white'>Report</p>
            </NavLink>
    </div>
  )
}

export default SideBarForAdmin