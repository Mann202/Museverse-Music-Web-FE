import NavLinks from "./NavLinks.jsx";
import logo from '../../assets/MuseverseMain.png'
import miniLogo from '../../assets/MiniLogo.png'
import { createContext, useState } from "react";
import {useNavigate} from 'react-router-dom'
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";

export const SideBarContext = createContext();
export default function SideBar() {
    const [expanded, setExpanded] = useState(true)
    const navigate = useNavigate()

  
    const changeRoute = () =>{ 
        let path = `/`; 
        navigate(path);
      }

    return(
        <div
        className={`md:flex flex-col h-screen py-6 px-4 bg-[#212124] overflow-y-scroll ${expanded ? "w-[240px]" : "w-[100px] py-3"} transition-all overflow-hidden`}
        >
            <div className={`${expanded ? "flex justify-end" : "flex justify-center items-center"}`}>
                <button className={` text-white ${expanded ? "w-3" : "w-9 h-12 pl-2"}`} onClick={() => {setExpanded(!expanded)}}>
                    {expanded ? <BsChevronBarLeft  /> : <BsChevronBarRight className="text-center text-2xl"/>}
                </button>
            </div>

            {expanded ? <img src={logo} onClick={changeRoute} className={`transition-all cursor-pointer`}></img> :
                <img src={miniLogo} onClick={changeRoute} className={`transition-all h-auto w-auto cursor-pointer`}></img>
            }
            
            <SideBarContext.Provider value={{expanded}}>
                <NavLinks />
            </SideBarContext.Provider>

        </div>
    )
}