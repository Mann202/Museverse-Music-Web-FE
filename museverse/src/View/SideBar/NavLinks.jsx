import { NavLink, useNavigate } from 'react-router-dom'
import { BiRadio, BiSolidPlaylist } from 'react-icons/bi';
import { IoIosAlbums } from 'react-icons/io'
import { BsMusicNoteBeamed } from 'react-icons/bs'
import { GiMicrophone } from 'react-icons/gi'
import { useContext, useEffect, useState } from 'react';
import { SideBarContext } from './SideBar';
import { FaPlus } from "react-icons/fa6";
import axios from 'axios';
import axiosInstance from '../../API/axios';

const links = [
    { name: "Tracks", to: "/likedTracks", icon: BsMusicNoteBeamed },
    { name: "Artists", to: "/followedArtists", icon: GiMicrophone },
]

const mainLinks = [
    { name: "Explore", to: "/" },
    { name: "Chart", to: "/chart" },
    { name: "History", to: "/history" },
]


export default function NavLinks({ handleClick }) {
    const { expanded } = useContext(SideBarContext)
    const user = localStorage.getItem('user')
    const userJson = JSON.parse(user);
    const userID = userJson.user_id;
    const [playlist, setPlaylist] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axiosInstance.get(`/api/getAllPlaylist?user_id=${userID}`).then(
            response => {
                setPlaylist(response.data)
            }
        )
    }, [])

    async function handleAddplaylist() {

        const user = localStorage.getItem('user')
        const userJson = JSON.parse(user);
        const userID = userJson.user_id;

        try {
            let playlistID = 0
            const response = await axiosInstance.get(`/api/getPlaylistID?user_id=${userID}`)
            if (response) {
                playlistID = response.data.id;
            } else {
                playlistID = 1
            }

            const title = "Your playlist"
            await axiosInstance.post(`/api/createPlaylist`, {
                user_id: userID,
                id: playlistID,
                title: title
            });

            const path = `/user-playlist/${playlistID + 1}`;
            navigate(path);
        } catch (error) {
            console.error("Error while adding playlist:", error);
        }
    }

    return (
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
                        <item.icon className={`text-[#EE5566] w-10 h-7 ${expanded ? "mr-2" : "ml-[3px]"}`} />
                        <span className={`overflow-hidden transition-all ${expanded ? "w-56 ml-3" : "visibility: hidden"}`}>
                            {item.name}
                        </span>
                    </NavLink>
                ))}
            </div>

            <div className='flex flex-row justify-between'>
                <h2 className={`text-gray-500 font-semibold ${expanded ? "" : "visibility: hidden"}`}>My Playlist</h2>
                <button onClick={handleAddplaylist} className={`text-[#EE5566] rounded-full p-1 ${expanded ? "mr-2" : "ml-[16px]"}`}>
                    <FaPlus className='text-2xl' />
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
