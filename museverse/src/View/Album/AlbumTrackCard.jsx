import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { BsDot, BsHeart, BsPlayFill, BsThreeDots } from 'react-icons/bs';

import { chuyenNgay } from '../Playlist/SplitNumber';

function ArtistTrackCard({ index, num, id, artists, name, duration }) {
  const [focus, setFocus] = useState(false)

  duration = duration * 0.000017
  const duration_minutes = Math.floor(duration)
  const duration_second = duration - duration_minutes
  const round_duration_second = Math.floor(duration_second * 60)

  if (round_duration_second < 10) {
    round_duration_second.toString();
    var round_duration_second_text = `0${round_duration_second}`
  }

  return (
    <>
      <div
        className="flex w-11/12 hover:bg-white/10 hover:bg-opacity-70 hover:rounded-lg py-1 items-center justify-between"
        onMouseEnter={() => {
          setFocus(true);
        }}
        onMouseLeave={() => {
          setFocus(false);
        }}
      >
        <div className="flex ml-10">
          <div className='flex items-center '>
            {focus ? (
              <BsPlayFill className="text-white opacity-70 text-2xl" />
            ) : (
              <p className="text-white text-opacity-50 w-5">{num}</p>
            )}
            <div className='ml-9'>
              <h3 className="text-white text-opacity-90 font-medium text-base cursor-pointer hover:underline">
                {name.length > 50 ? name.slice(0, 50) + "..." : name}
              </h3>
              {
                artists.map((item, index) => (
                  <NavLink to={`/artist/${item.id}`} className="text-[#AFAFAF] text-opacity-90 font-medium text-base cursor-pointer hover:underline hover:text-white w-full">
                    {item.name}{index !== artists.length - 1 ? `, ` : ''}
                  </NavLink>
                ))
              }
            </div>
          </div>
        </div>
        <div className="flex gap-4 pr-3">
          <span className="text-white opacity-70 text-2xl">
            {focus ? (
              <BsHeart className='visible' />
            ) : <BsHeart className='invisible' />
            }
          </span>
          <p className="text-white text-opacity-50 font-medium text-sm">
            {duration_minutes}:
            {round_duration_second < 10
              ? round_duration_second_text
              : round_duration_second}
          </p>
          <span className="text-white opacity-70 text-2xl">
            {focus ? (
              <BsThreeDots className='visible' />
            ) : <BsThreeDots className='invisible' />
            }
          </span>
        </div>
      </div>
    </>
  );
}

export default ArtistTrackCard