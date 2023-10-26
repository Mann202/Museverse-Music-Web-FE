import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { AiOutlineLeft, AiOutlineRight} from 'react-icons/ai'
import { IoIosNotifications } from 'react-icons/io'
import {MdNotificationsActive} from 'react-icons/md'

import SearchBar from './SearchBar'
import Notification from '../Notification/Notification'
import DropDownMenu from '../Notification/DropdownMenu'

import axios from 'axios'
import avatar from "../assets/avatar.png"
import { Spotify } from '../API/Credentials'

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
    const [notification, setNotification] = useState(false)
    const [dropdownMenu, setDropdownMenu] = useState(false)
    const [data,setData] = useState([])
    
    const ClientID = Spotify.ClientID
    const ClientSecret = Spotify.ClientSecret

    useEffect(() => {
        // Gọi API để lấy token
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(ClientID + ':' + ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
        .then(response => {
            // Gọi API Spotify ngay sau khi nhận được token
            axios('https://api.spotify.com/v1/browse/new-releases?country=VN&limit=1', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.albums.items); // Lưu dữ liệu từ API vào state
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
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
            <div className="flex justify-between items-center bg-[#171719] h-16 mx-auto">
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
                    <button onClick={HandleClickDropdown}>
                        <img src={avatar} className='rounded-full w-10 h-10'></img>
                    </button>
                    <button onClick={HandleClickNotification} className="bg-[#EBEBFF0D] text-white rounded-lg w-10 h-10 flex justify-center items-center hover:bg-[#323232]">
                        {notification ? <MdNotificationsActive className="text-xl"/> : <IoIosNotifications className="text-xl"/>}
                    </button>
                </div>
            </div>
            {notification ? <Notification notification={notification} data={data}/> : ""}
            {dropdownMenu ? <DropDownMenu /> : ""}
        </>
    )
}