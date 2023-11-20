import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoggedContext } from '../../Login-SignUp/LoggedContext';

function DropdownMenu() {
  const {logged, setLogged} = useContext(LoggedContext);

  const handleLogOut = () => {
    setLogged(false);
    localStorage.clear();
  };

  return (
    <div className="absolute right-20 flex flex-col text-[#FFFFFF] bg-black bg-opacity-80 w-48 py-5 px-3 mt-1 text-lg gap-4 rounded">
      <NavLink to="/profile">Profile</NavLink>
      <NavLink>Upgrade to Premium</NavLink>
      <NavLink>Settings</NavLink>
      <NavLink onClick={handleLogOut} to={"/signin"}>Logout</NavLink>
    </div>
  );
}

export default DropdownMenu;