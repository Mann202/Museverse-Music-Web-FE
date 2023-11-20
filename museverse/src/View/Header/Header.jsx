import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { IoIosNotifications } from 'react-icons/io'
import { MdNotificationsActive } from 'react-icons/md'

import SearchBar from './HeaderSearchBar'
import Notification from './Notification/Notification'
import DropdownMenu from './Notification/DropdownMenu'

import avatar from '../../assets/avatar.png'
import { Spotify } from '../../API/Credentials'
import { LoggedContext } from '../Login-SignUp/LoggedContext'

export default function Headers({ bgColor }) {
    return (
        <div>
            <LoggedHeader bgColor={bgColor} />
        </div>
    )
}

export function LoggedHeader({ bgColor, showHello }) {

    const [logged, setLogged] = useState('');
    useEffect(()=>{
        if(!localStorage.getItem('user'))
          setLogged(false);
        else
        setLogged(true);
      })
    const [notification, setNotification] = useState(false)
    const [dropdownMenu, setDropdownMenu] = useState(false)
    const [data, setData] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để lấy token
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(response => {
                axios('https://api.spotify.com/v1/browse/new-releases?country=VN&limit=1', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + response.data.access_token
                    }
                }).then(json => {
                    setData(json.data.albums.items);
                })
            })
    }, []);

    function HandleClickNotification() {
        setNotification(!notification)
        setDropdownMenu(false)
        console.log(dropdownMenu)
    }

    function HandleClickDropdown() {
        setDropdownMenu(!dropdownMenu)
        setNotification(false)
    }

    return (
        <>
            <div style={{ background: `${bgColor}` }} className="flex justify-between items-center bg-[#131313] h-16 mx-auto">
                <div className="flex gap-2 ml-4">
                    <button onClick={() => { navigate(-1) }} className={`text-[#EE5566] bg-black rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white`}>
                        <AiOutlineLeft className='text-xl font-semibold' />
                    </button>
                    {showHello && (
                        <p className="text-white">Hello</p>
                    )}

                    <button onClick={() => { navigate(1) }} className="text-[#EE5566] bg-black rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white">
                        <AiOutlineRight className='text-xl font-semibold' />
                    </button>
                </div>

                <div className="flex gap-4 mr-4 justify-center items-center">
                    <SearchBar />
                    {logged ?                        
                        <div className="flex flex-row-reverse items-start items-center bg-transparent h-16 gap-2">
                            <button onClick={HandleClickDropdown}>
                                <img src={avatar} className='rounded-full w-10 h-10' alt="Museverse"></img>
                            </button>
                            <button onClick={HandleClickNotification} className="bg-black bg-opacity-80 text-[#EE5566] rounded-lg w-10 h-10 flex justify-center items-center hover:bg-[#323232]">
                                {notification ? <MdNotificationsActive className="text-xl" /> : <IoIosNotifications className="text-xl" />}
                            </button>
                        </div>
                        :
                        <div className="flex flex-row-reverse items-start align-middle bg-transparent h-16">
                            <div className="flex items-center h-full gap-2">
                                <button className='rounded-full text-gray-400 text-lg font-medium py-2 px-12 hover:text-white hover:font-bold bg-black' onClick={()=>{navigate('/signup');}}>
                                    Sign up
                                </button>
                                <button className='rounded-full bg-white text-stone-950 text-lg font-medium py-2 px-12 hover:font-bold' onClick={()=>{navigate('/signin');}}>
                                    Log in
                                </button>
                            </div>
                        </div>
                    }
                </div>

            </div>
            {notification ? <Notification notification={notification} data={data} /> : ""}
            {dropdownMenu ? <DropdownMenu /> : ""}
        </>
    )
}