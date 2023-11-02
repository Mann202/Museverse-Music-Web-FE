import React, {useState} from 'react'
import { convertMsToMinSec } from '../Playlist/SplitNumber'
import { BsPauseFill, BsPlay, BsPlayFill } from 'react-icons/bs'

function SearchingTrackCard({img, name, artists, duration, setPlayingTrack, isPlaying, playingData, setPlay, uri}) {
    const [hover, setHover] = useState(false)

    function handleClick() {
        setPlayingTrack(uri)
    }

    return (
        <div onMouseEnter={()=>{setHover(true)}} onMouseLeave={()=>{setHover(false)}} className='flex flex-row justify-between hover:bg-white hover:bg-opacity-10 py-1 px-2 rounded-lg'>
            <div className='flex flex-row gap-2'>
                <img src={img} alt='' className='w-12 h-12'></img>
                <div>
                    <h1 className='text-white font-semibold text-lg'>{(name.length > 60 ? name.slice(0,59) + '...' : name)}</h1>
                    <div className='flex flex-row'>
                        {
                            artists.map((item, index) => (
                                <p className='text-white font-light text-sm text-opacity-80'>{item.name}{index !== artists.length - 1 ? ", " : ""}</p>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                <button>
                {
                    (playingData.name === name) 
                    ?
                    (isPlaying)
                        ? 
                        <BsPauseFill onClick={()=>{setPlay(false)}} className='text-white text-3xl' />
                    :
                        <BsPlayFill onClick={()=>{setPlay(true)}} className='text-white text-3xl'/>
                    :
                        hover 
                        ?
                        <BsPlayFill onClick={handleClick} className='text-white text-3xl'/>
                        :
                        ""
                }
                </button>
                <p className='text-white text-opacity-80'>{convertMsToMinSec(duration)}</p>
            </div>
        </div>
  )
}

export default SearchingTrackCard