import React, { useState } from 'react'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { NavLink, useNavigate } from 'react-router-dom'
import { getTimeDifference } from './SplitNumber'

function PlaylistCard({ id, index, name, album, date, duration, image, artist, currentPlay, setTrackInAlbum, playingTrack, uri, setPlayingTrack, data }) {
    const [focus, setFocus] = useState(false)
    const navigate = useNavigate()

    function changeRouteTrack() {
        const path = `/track/${id}`
        navigate(path)
    }

    duration = duration * 0.000017
    const duration_minutes = Math.floor(duration)
    const duration_second = duration - duration_minutes
    const round_duration_second = Math.floor(duration_second * 60)

    if (round_duration_second < 10) {
        round_duration_second.toString();
        var round_duration_second_text = `0${round_duration_second}`
    }

    const dateTimeString = date;
    const dateTime = new Date(dateTimeString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateTime.toLocaleDateString(undefined, options);

    const tracks = []
    data.forEach((item) => {
        tracks.push(item.track.uri)
    })

    function handleClick() {
        if (playingTrack.length == 0 || playingTrack.length != 0) {
            setPlayingTrack(tracks)
        }
        setTrackInAlbum(index)
    }


    return (
        <>
            <div className={`flex felx-row w-11/12 gap-7 hover:bg-white/10 hover:bg-opacity-70 hover:rounded-lg py-1 ${(currentPlay == id || focus) ? "pl-2" : "pl-3"}`}
                onMouseEnter={() => { setFocus(true) }}
                onMouseLeave={() => { setFocus(false) }}
            >
                <div className="flex flex-row gap-8 w-5/12">
                    <div className="flex flex-row items-center">
                        {
                            (currentPlay == id)
                                ?
                                <BsPauseFill className='text-white text-opacity-90 text-2xl' />
                                :
                                focus
                                    ? <button onClick={handleClick}><BsPlayFill className="text-white text-opacity-90 text-2xl" onClick={handleClick} /></button>
                                    : <p className="text-white text-opacity-50 w-5">{index + 1}</p>
                        }
                    </div>
                    <div className="flex flex-row items-center">
                        <img src={image} className="w-12 h-12 rounded-lg"></img>
                    </div>
                    <div>
                        <h3 className="text-white text-opacity-90 font-medium text-base cursor-pointer hover:underline"
                            onClick={() => { changeRouteTrack() }}
                        >
                            {(name.length > 50) ? name.slice(0, 50) + "..." : name}
                        </h3>
                        <div className='flex flex-row'>
                            {artist.map((item, index) => (
                                <NavLink to={`/artist/${item.id}`} className={`text-sm text-white font-semibold hover:underline ${focus ? "text-opacity-100" : "text-opacity-50"}`} key={index}>
                                    {item.name}{index !== artist.length - 1 ? `, ` : ''}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-7/12 gap-32">
                    <div className="w-40 flex items-center">
                        <NavLink to={`/album/${album.id}`} className={`text-white font-medium text-sm hover:underline ${focus ? "text-opacity-100" : "text-opacity-50"}`} key={index}>
                            {album.name}
                        </NavLink>
                    </div>
                    <div className="w-60 flex items-center">
                        <p className="text-white text-opacity-50 font-medium text-sm">{getTimeDifference(formattedDate)}</p>
                    </div>
                    <div className="flex items-center w-16 justify-center">
                        <p className="text-white text-opacity-50 font-medium text-sm">{duration_minutes}:{(round_duration_second < 10) ? round_duration_second_text : round_duration_second}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlaylistCard