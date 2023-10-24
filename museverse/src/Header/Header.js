import { useState } from 'react'
import { AiOutlineLeft, AiOutlineRight} from 'react-icons/ai'
import { NavLink } from 'react-router-dom'
import avatar from "../assets/avatar.png"
import { IoIosNotifications } from 'react-icons/io'
import SearchBar from './SearchBar'

export default function Headers() {
    const [logged, isLogged] = useState(false)

    return(
        <div>
            {logged ? 
            
            <div className="flex flex-row-reverse items-start align-middle bg-black h-16">
                <div className="mt-2 mr-5 h-16">
                    <button className='rounded-full text-gray-400 text-lg font-medium py-2 px-12 hover:text-white hover:font-bold'>
                        Sign up
                    </button>
                    <button className='rounded-full bg-white text-stone-950 text-lg font-medium py-2 px-12 hover:font-bold'>
                        Log in
                    </button>
                </div>
            </div>
            :
            <LoggedHeader />    
        }
        </div>
    )
}


export function LoggedHeader() {
    return (
        <>
            <div className="flex justify-between items-center bg-opacity-100  h-16 mx-auto">
                <div className="flex gap-2 ml-4">
                    <button className="text-[#EBEBFF0D] bg-[#1F1F22] rounded-full h-10 w-10 flex justify-center items-center hover:border-2 hover:text-white hover:border-white">
                        <AiOutlineLeft />
                    </button>

                    <button className="text-[#EBEBFF0D] bg-[#1F1F22] rounded-full h-10 w-10 flex justify-center items-center hover:border-2 hover:text-white hover:border-white">
                        <AiOutlineRight />
                    </button>
                </div>

                <div className="flex gap-4 mr-4">
                    <SearchBar />
                    <img src={avatar} className='rounded-full w-10 h-10'></img>
                    <button className="bg-[#EBEBFF0D] text-white rounded-lg w-10 h-10 flex justify-center items-center">
                        <IoIosNotifications className="text-xl"/>
                    </button>
                </div>
            </div>
        </>
    )
}