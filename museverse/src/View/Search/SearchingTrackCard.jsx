import React from 'react'
import { convertMsToMinSec } from '../Playlist/SplitNumber'

function SearchingTrackCard({img, name, artists, duration}) {
  return (
    <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-2'>
            <img src={img} alt='' className='w-12 h-12'></img>
            <div>
                <h1 className='text-white font-semibold text-lg'>{name}</h1>
                <div className='flex flex-row'>
                    {
                        artists.map((item, index) => (
                            <p className='text-white font-light text-sm text-opacity-80'>{item.name}{index !== artists.length - 1 ? ", " : ""}</p>
                        ))
                    }
                </div>
            </div>
        </div>

        <div>
            <p className='text-white text-opacity-80'>{convertMsToMinSec(duration)}</p>
        </div>
    </div>
  )
}

export default SearchingTrackCard