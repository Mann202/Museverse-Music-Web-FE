import {NavLink, useNavigate} from 'react-router-dom'
import {BiRadio, BiSolidPlaylist} from 'react-icons/bi';
import {IoIosAlbums} from 'react-icons/io'
import  {BsMusicNoteBeamed } from 'react-icons/bs'
import {GiMicrophone} from 'react-icons/gi'
import { useContext, useEffect, useState } from 'react';
import { SideBarContext } from './SideBar';
import { FaPlus } from "react-icons/fa6";
import axios from 'axios';

const links = [
    {name: "Mixes and Radio", to: "/mix&radio", icon: BiRadio},
    {name: "Playlist", to:"/playlist", icon: BiSolidPlaylist},
    {name: "Albums", to: "/albums", icon: IoIosAlbums},
    {name: "Tracks", to: "/likedTracks", icon: BsMusicNoteBeamed},
    {name: "Artists", to: "/followedArtists", icon: GiMicrophone},
]

const mainLinks = [
    {name: "Explore", to: "/"},
    {name: "Chart", to: "/chart"},
    {name: "History", to: "/history"},
]


export default function NavLinks ({handleClick}) {
    const {expanded} = useContext(SideBarContext)
    const user = localStorage.getItem('user')
    const userJson = JSON.parse(user);
    const userID = userJson.user_id;
    const [playlist, setPlaylist] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/getAllPlaylist?user_id=${userID}`).then(
            response => {
                setPlaylist(response.data)
            }
        )
    },[])

    function handleAddplaylist() {

        const user = localStorage.getItem('user')
        const userJson = JSON.parse(user);
        const userID = userJson.user_id;

        let playlistID = 0
        axios.get(`http://127.0.0.1:8000/api/getPlaylistID?user_id=${userID}`).then(response => {
            if(response == undefined) {
                playlistID = 1
            } else {
                playlistID = response.data.id
            }
            const title = "Your playlist"
            axios.post(`http://127.0.0.1:8000/api/createPlaylist`, {
                user_id : userID,
                id: playlistID,
                title: title
            })
        }).then(() =>
            {
                const path =`/user-playlist/${playlistID+1}`
                navigate(path)
            }
        )
    }

    return(
        <div className={`${expanded ? "" : ""}`}>
            {mainLinks.map((item) => (
            <NavLink
                key={item.name}
                to={item.to}
                className={`flex flex-row justify-start items-center transition-all overflow-hidden my-8 text-lg font-semibold text-gray-100 hover:text-[#EE5566] 
                ${expanded ? "" : "visibility: hidden"}`}
                onClick={() => handleClick && handleClick()}
            >
                {item.name}
            </NavLink>
            ))}


            <div className='flex flex-row justify-between'>
                <h2 className={`text-gray-500 font-semibold ${expanded ? "" : "visibility: hidden"}`}>My Libary</h2>
            </div>

            <div className="overflow-auto">
                {links.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.to}
                    className="flex flex-row justify-start items-center ml-2 my-8 text-sm font-medium text-gray-100 hover:text-[#EE5566]"
                    onClick={() => handleClick && handleClick()}
                >
                    <item.icon className={`w-10 h-7 ${expanded ? "mr-2" : "ml-[3px]"}`} />
                    <span className={`overflow-hidden transition-all ${expanded ? "w-56 ml-3" : "visibility: hidden"}`}>
                        {item.name}
                    </span>
                </NavLink>
                ))}
            </div>

            <div className='flex flex-row justify-between'>
                <h2 className={`text-gray-500 font-semibold ${expanded ? "" : "visibility: hidden"}`}>My Playlist</h2>
                <button onClick={handleAddplaylist} className='text-[#EE5566] rounded-full p-1'>
                    <FaPlus className='text-xl'/>
                </button>
            </div>

            <div className={`overflow-auto transition-all ${expanded ? "" : "visibility: hidden"}`}>
                {playlist.map((item) => (
                <NavLink
                    key={item.title_playlist}
                    to={`/user-playlist/${item.id}`}
                    className="flex flex-row justify-start items-center rounded-md py-5 pr-8 pl-3 my-8 text-sm font-medium text-gray-100 hover:bg-[#EE5566] hover:bg-opacity-50"
                    onClick={() => handleClick && handleClick()}
                >
                    {item.title_playlist}
                </NavLink>
                ))}
            </div>
        </div>
    )
}
