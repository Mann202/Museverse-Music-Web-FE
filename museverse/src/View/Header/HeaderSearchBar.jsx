import { useState } from "react";
import { useNavigate  } from 'react-router-dom'

import { AiOutlineSearch } from "react-icons/ai";


export default function SearchBar() {
    const [focus, setFocus] = useState(false)

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/search`; 
        navigate(path);
    }

    return (
        <>
            <div className={`bg-black bg-opacity-90 w-[389px] h-[40px] flex flex-row rounded-lg ${focus ? "border-[#EE5566] border-2" : ""} `}>
                <div className="flex justify-center items-center">
                    <AiOutlineSearch className={`mx-2 text-xl ${focus ? "text-[#EE5566]" : "text-[#939393]"}`}/>
                </div>
                <input placeholder="Search" onClick={routeChange} onFocus={()=> {setFocus(true)}} onBlur={() => {setFocus(false)}} className="w-full text-[#FCFCFC] rounded-lg bg-black/5 bg-opacity-10 placeholder-[#939393] focus: outline-none">
                </input>
            </div>
        </>
    )
}