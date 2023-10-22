import { NavLink } from "react-router-dom";
import {BsFillPlayFill} from 'react-icons/bs'
import {AiOutlineHeart} from 'react-icons/ai'

export default function CardChart({img, name, artist, release_date}) {
    
    return(
        <>
            <div className="flex felx-row justify-between w-full h-28 border-t-2 border-[#2C2C2C] pt-2 pb-3 hover:bg-[#323232]">
                <div className="flex flex-row gap-8 w-72">
                    <img src={img} className="w-[87px] h-[87px] rounded-lg"></img>
                    <div>
                        <h3 className="text-white font-bold text-xl">
                            {name}
                        </h3>
                        <p className="text-[#B4B4B4] font-medium text-sm">{artist}</p>
                    </div>
                </div>
                <div>
                    <br></br>
                    <p className="text-[#B1B1B1] font-medium text-sm">{release_date}</p>
                </div>
                <div className="flex flex-row gap-5 mr-5">
                    <button className="rounded-full flex justify-center items-center w-10 h-10">
                        <AiOutlineHeart className="text-white text-3xl"/>
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