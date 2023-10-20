import NavLinks from "./NavLinks.js";
import logo from '../assets/MuseverseMain.png'
import miniLogo from '../assets/MiniLogo.png'
import { createContext, useState } from "react";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";

export const SideBarContext = createContext();
export default function SideBar() {
    const [expanded, setExpanded] = useState(true)

    return(
        <div
        className={`md:flex flex-col h-screen py-10 px-4 bg-[#212124] overflow-y-scroll ${expanded ? "w-[240px]" : "w-[100px]"} transition-all overflow-hidden`}>
            <div className={`${expanded ? "flex justify-end" : "flex justify-center items-center"}`}>
                <button className={` text-white ${expanded ? "w-3" : "w-9 h-12 pl-2"}`} onClick={() => {setExpanded(!expanded)}}>
                    {expanded ? <BsChevronBarLeft  /> : <BsChevronBarRight className="text-center text-2xl"/>}
                </button>
            </div>

            {expanded ? <img src={logo} className={`transition-all`}></img> :
                <img src={miniLogo} className={`transition-all h-auto w-auto`}></img>
            }
            
            <SideBarContext.Provider value={{expanded}}>
                <NavLinks />
            </SideBarContext.Provider>

        </div>
    )
}