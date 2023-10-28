import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { BsPlayFill } from 'react-icons/bs';

import { chuyenNgay } from '../Playlist/SplitNumber';

function ArtistTrackCard({index, id, image, name, duration, release_date}) {
    const [focus, setFocus] = useState(false)

    duration = duration * 0.000017
    const duration_minutes = Math.floor(duration)
    const duration_second = duration - duration_minutes
    const round_duration_second = Math.floor(duration_second * 60)

    if(round_duration_second < 10) {
        round_duration_second.toString();
        var round_duration_second_text = `0${round_duration_second}`
    }

  return (
    <>
      <div
        className="flex flex-row justify-between w-11/12 gap-20 pl-3 hover:bg-white/10 hover:bg-opacity-70 hover:rounded-lg py-1"
        onMouseEnter={() => {
          setFocus(true);
        }}
        onMouseLeave={() => {
          setFocus(false);
        }}
      >
        <div className="flex flex-row gap-8 w-5/12">
          <div className="flex flex-row items-center">
            {focus ? (
              <BsPlayFill className="text-white opacity-70 text-2xl" />
            ) : (
              <p className="text-white text-opacity-50 w-5">{index + 1}</p>
            )}
          </div>
          <div className="flex flex-row items-center">
            <img src={image} className="w-12 h-12 rounded-lg"></img>
          </div>
          <div className="flex items-center">
            <h3
              className="text-white text-opacity-90 font-medium text-base cursor-pointer hover:underline"
            >
              {name.length > 50 ? name.slice(0, 50) + "..." : name}
            </h3>
          </div>
        </div>
        <div className="flex flex-row w-4/12 gap-32">
          <div className="w-60 flex items-center">
            <p className="text-white text-opacity-50 font-medium text-sm">
              {chuyenNgay(release_date)}
            </p>
          </div>
          <div className="flex items-center w-16 justify-center">
            <p className="text-white text-opacity-50 font-medium text-sm">
              {duration_minutes}:
              {round_duration_second < 10
                ? round_duration_second_text
                : round_duration_second}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArtistTrackCard