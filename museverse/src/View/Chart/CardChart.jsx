import { NavLink } from "react-router-dom";
import {BsFillPlayFill} from 'react-icons/bs'
import {AiOutlineHeart} from 'react-icons/ai'
import { useState } from "react";

export default function CardChart({img, name, artist, release_date}) {
    const [focus, setFocus] = useState(false)

    release_date = release_date * 0.000017
    const duration_minutes = Math.floor(release_date)
    const duration_second = release_date - duration_minutes
    const round_duration_second = Math.floor(duration_second * 60)

    if(round_duration_second < 10) {
        round_duration_second.toString();
        var round_duration_second_text = `0${round_duration_second}`
    }
    
    return(
        <>
            <div className="flex felx-row justify-between w-full h-28 border-t-[1px] border-[#2C2C2C] pt-3 pb-5 pl-3 hover:bg-[#323232] hover:rounded-lg"
            onMouseEnter={() => {setFocus(true)}}
            onMouseLeave={() => {setFocus(false)}}
            >
                <div className="flex flex-row gap-8 w-72">
                    <img src={img} className="w-[87px] h-[87px] rounded-lg"></img>
                    <div>
                        <h3 className="text-white font-bold text-xl">
                            {(name.length > 50) ? name.slice(0,50) + "..." : name}
                        </h3>
                        <p className="text-[#B4B4B4] font-medium text-sm">{artist}</p>
                    </div>
                </div>
                <div>
                    <br></br>
                    <p className="text-[#B1B1B1] font-medium text-sm">{duration_minutes}:{(round_duration_second < 10) ? round_duration_second_text : round_duration_second}</p>
                </div>
                <div className="flex flex-row gap-5 mr-5 mt-2">
                    <button className="rounded-full flex justify-center items-center w-10 h-10">
                        <AiOutlineHeart className={` text-3xl ${focus ? "text-white" : "text-transparent"}`}/>
                    </button>
                    <button className="bg-[#1FD662] w-10 h-10 rounded-full flex justify-center items-center">
                        <NavLink >
                            <BsFillPlayFill className="text-white text-2xl"/>
                        </NavLink>
                    </button>
                </div>
            </div>
        </>
    )
}