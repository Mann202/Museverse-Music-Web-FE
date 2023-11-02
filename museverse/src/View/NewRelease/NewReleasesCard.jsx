import React, { useState } from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { NavLink, useNavigate } from 'react-router-dom'


const NewReleasesCard = ({ id, artists, name, image }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate()
    function changeRouteAlbum() {
        const path = `/album/${id}`
        navigate(path)
    }

    return (
        <div
            onClick={changeRouteAlbum}
            className={`bg-black bg-opacity-30 hover:bg-white/10 hover:bg-opacity-70 hover:rounded-lg h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden">
                <img src={image} className="rounded-xl w-40 h-40 mt-3" alt={name} />
                {isHovered ?
                    <div className={`absolute bottom-0 right-0 p-2 transtion-all overflow-hidden`}>
                        <ButtonPlay />
                    </div> : ""
                }
            </div>
            <div className="w-40 pb-4">
                <div>
                    <h3 className="font-semibold text-base text-white">
                        {name.length > 15 ? name.slice(0, 15) + '...' : name}
                    </h3>
                    <p className="font-normal text-sm text-[#9898A6]">
                        {artists.map((item, index) => (
                            <NavLink to={`/artist/${item.id}`} className="text-[#AFAFAF] text-opacity-90 font-medium text-base cursor-pointer hover:underline hover:text-white w-full">
                                {item.name}{index !== artists.length - 1 ? `, ` : ''}
                            </NavLink>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ButtonPlay() {
    return (
        <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
            <BsPlayFill className="text-black text-3xl" />
        </button>
    );
}

export default NewReleasesCard