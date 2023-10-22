import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";


export default function SearchBar() {
    const [focus, setFocus] = useState(false)

    return (
        <>
            <div className={`bg-[#1F1F22] w-[389px] h-[40px] flex flex-row rounded-lg ${focus ? "border-white border-2" : ""} `}>
                <div className="flex justify-center items-center">
                    <AiOutlineSearch className={`mx-2 text-xl ${focus ? "text-white" : "text-[#939393]"}`}/>
                </div>
                <input placeholder="Search" onFocus={()=> {setFocus(true)}} onBlur={() => {setFocus(false)}}className="w-full text-[#FCFCFC] rounded-lg bg-[#1F1F22] placeholder-[#939393] focus: outline-none"></input>
            </div>
        </>
    )
}