import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { FaStore } from "react-icons/fa";
import logo from '../../assets/MuseverseMain.png'
import { FaBorderAll } from "react-icons/fa";
import { TbReportAnalytics } from 'react-icons/tb';

function SideBarForDistributor() {
    const navigate = useNavigate()
    const changeRoute = () =>{ 
        let path = `/`; 
        navigate(path);
      }

  return (
    <div className='md:flex flex-col gap-5 h-screen py-6 px-4 bg-[#121212] overflow-y-scroll w-[240px] transition-all overflow-hidden'>
            <img src={logo} onClick={changeRoute} className={`transition-all cursor-pointer`}></img>

            <NavLink to={`/`} className='flex flex-row gap-3'>
                <FaStore className='text-[#EE5566] mt-2 text-lg'/>
                <p className='text-white text-xl text-opacity-80'>Your store</p>
            </NavLink>

            <NavLink to={`/orders`} className='flex flex-row gap-3'>
                <FaBorderAll className='text-[#EE5566] mt-2 text-lg'/>
                <p className='text-white text-xl text-opacity-80'>Orders</p>
            </NavLink>

            <NavLink to={`/report`} className='flex flex-row gap-3'>
                <TbReportAnalytics className='text-[#EE5566] mt-2 text-lg'/>
                <p className='text-white text-xl text-opacity-80'>Report</p>
            </NavLink>
    </div>
  )
}

export default SideBarForDistributor