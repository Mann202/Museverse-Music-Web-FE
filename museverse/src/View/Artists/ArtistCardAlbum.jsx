import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom' 
import { BsPlayFill } from 'react-icons/bs';

import { chuyenNgay } from '../Playlist/SplitNumber';

function ArtistCardAlbum({ id, name, release , image, dark }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()

  /* function changeRoute() {
    const path = `/playlist/${id}`
    navigate(path)
  } */

  return (
    <div
      className={`${dark ? "bg-white bg-opacity-10 hover:bg-opacity-20" : "bg-black bg-opacity-30 hover:bg-opacity-60"} h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 hover:bg-opacity-60 cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      //onClick={changeRoute}
    >
      <div className="relative overflow-hidden">
        <img src={image} className="rounded-xl w-40 h-40 mt-3" alt={name} />
        { isHovered ?
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
            {chuyenNgay(release)}
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

export default ArtistCardAlbum
