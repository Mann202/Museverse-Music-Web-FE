import React from 'react'
import { NavLink } from 'react-router-dom'

function DropdownMenu() {
  return (
    <div className="absolute right-20 flex flex-col text-[#FFFFFF] bg-[#7272724D] w-48 py-5 px-3 text-lg gap-4 rounded">
        <NavLink>Profile</NavLink>
        <NavLink>Upgrade to Premium</NavLink>
        <NavLink>Settings</NavLink>
        <NavLink>Logout</NavLink>
    </div>
  )
}

export default DropdownMenu