import { NavLink } from "react-router-dom";
import {BsFillPlayFill} from 'react-icons/bs'
import {AiOutlineHeart} from 'react-icons/ai'
import { useState } from "react";
import { convertMsToMinSec } from "../Playlist/SplitNumber";

export default function CardChart({img, name, artist, duration_ms, uri, setPlayingTrack, id}) {
    const [focus, setFocus] = useState(false)

    function handleClick() {
        setPlayingTrack(uri)
    }

    function handleLiked() {
        const user = localStorage.getItem('user')
        const userJson = JSON.parse(user);
        const userID = userJson.user_id;
    }
    
    return(
        <>
            <div className="flex felx-row justify-between w-full h-28 border-t-[1px] border-[#2C2C2C] pt-3 pb-5 pl-3 hover:bg-[#323232] hover:rounded-lg"
            onMouseEnter={() => {setFocus(true)}}
            onMouseLeave={() => {setFocus(false)}}
            >
                <div className="flex flex-row gap-8 w-96">
                    <img src={img} className="w-[87px] h-[87px] rounded-lg"></img>
                    <div className="w-72">
                        <NavLink to={`/track/${id}`} className="text-white font-bold text-xl hover:underline">
                            {(name.length > 50) ? name.slice(0,50) + "..." : name}
                        </NavLink>
                        <div className="flex flex-row">
                        {
                            artist.map((item, index) => (
                                <NavLink to={`/artist/${item.id}`} className={`text-sm text-white font-semibold hover:underline ${focus ? "text-opacity-100" : "text-opacity-50"}`} key={index}>
                                    {item.name}{index !== artist.length - 1 ? `, ` : ''} 
                                </NavLink>
                        ))}
                        </div>
                    </div>
                </div>
                <div>
                    <br></br>
                    <p className="text-[#B1B1B1] font-medium text-sm">{convertMsToMinSec(duration_ms)}</p>
                </div>
                <div className="flex flex-row gap-5 mr-5 mt-2">
                    <button onClick={handleLiked} className="rounded-full flex justify-center items-center w-10 h-10">
                        <AiOutlineHeart className={` text-3xl ${focus ? "text-white" : "text-transparent"}`}/>
                    </button>
                    <button onClick={handleClick} className="bg-[#EE5566] w-10 h-10 rounded-full flex justify-center items-center">
                        <NavLink >
                            <BsFillPlayFill className="text-white text-2xl"/>
                        </NavLink>
                    </button>
                </div>
            </div>
        </>
    )
}