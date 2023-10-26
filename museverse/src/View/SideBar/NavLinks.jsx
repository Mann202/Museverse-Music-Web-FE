import {NavLink} from 'react-router-dom'
import {BiRadio, BiSolidPlaylist} from 'react-icons/bi';
import {IoIosAlbums} from 'react-icons/io'
import  {BsMusicNoteBeamed } from 'react-icons/bs'
import {GiMicrophone} from 'react-icons/gi'
import { useContext } from 'react';
import { SideBarContext } from './SideBar';

const links = [
    {name: "Mixes and Radio", to: "/mix&radio", icon: BiRadio},
    {name: "Playlist", to:"/playlist", icon: BiSolidPlaylist},
    {name: "Albums", to: "/albums", icon: IoIosAlbums},
    {name: "Tracks", to: "/tracks", icon: BsMusicNoteBeamed},
    {name: "Artists", to: "/artists", icon: GiMicrophone},
]

const mainLinks = [
    {name: "Explore", to: "/"},
    {name: "Chart", to: "/chart"},
    {name: "History", to: "/history"},
]

const albums = [
    {content: "Mixes and Radio"},
    {content: "September"},
    {content: "Clubbing"},
    {content: "Chil story 2"},
    {content: "Playlist 342"},
    {content: "Tracks"}
] //Mẫu thôi, mốt get dữ liệu lên thì bỏ dô album này


export default function NavLinks ({handleClick}) {
    const {expanded} = useContext(SideBarContext)

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


            <h2 className={`text-gray-500 font-semibold ${expanded ? "" : "visibility: hidden"}`}>My Libary</h2>
            
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

            <h2 className={`overflow-hidden transition-all text-gray-500 font-semibold ${expanded ? "" : "visibility: hidden"}`}>My Playlist</h2>

            <div className={`overflow-auto transition-all ${expanded ? "" : "visibility: hidden"}`}>
                {albums.map((item) => (
                <NavLink
                    key={item.content}
                    to={item.content}
                    className="flex flex-row justify-start items-center rounded-md py-5 pr-8 pl-3 my-8 text-sm font-medium text-gray-100 hover:bg-[#EE5566] hover:bg-opacity-50"
                    onClick={() => handleClick && handleClick()}
                >
                    {item.content}
                </NavLink>
                ))}
            </div>
        </div>
    )
}
