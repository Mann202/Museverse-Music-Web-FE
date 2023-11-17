import React, { useCallback } from 'react'
import { NavLink } from 'react-router-dom'

function DropdownMenu() {
  return (
    <div className="absolute right-20 flex flex-col text-[#FFFFFF] bg-black bg-opacity-80 w-48 py-5 px-3 mt-1 text-lg gap-4 rounded">
        <NavLink to="/profile" onClick={useCallback}>Profile</NavLink>
        <NavLink>Upgrade to Premium</NavLink>
        <NavLink>Settings</NavLink>
        <NavLink>Logout</NavLink>
    </div>
  )
}

export default DropdownMenu