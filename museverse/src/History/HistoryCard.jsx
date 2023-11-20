import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Spotify } from '../API/Credentials';
import Loading from '../View/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';

function HistoryCard({track_id, currentPlay, setPlay, setTrackInAlbum, playingTrack, setPlayingTrack, playingData, isPlaying, setPlayingID}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [focus, setFocus] = useState(false)
    const navigate = useNavigate()

    function handleChange() {
        const path = `/track/${track_id}`
        navigate(path)
      }

    useEffect(() => {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(response => {
                const token = response.data.access_token;
                axios(`https://api.spotify.com/v1/tracks/${track_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                    console.log(response.data)
                    setData(response.data)
                    setLoading(false)
                })
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    

    function handleFetch() {
        setPlay(true)
        setPlayingTrack(data.uri)
    }

    if(loading) return <Loading />
    return(
        <div className='flex justify-center pt-3'>
            <div className='flex flex-row justify-between gap-3 w-10/12 bg-[#181818] hover:bg-[#282828] rounded-lg py-2'
            onMouseEnter={() => { setFocus(true) }}
            onMouseLeave={() => { setFocus(false) }}
            >
                <div className='flex flex-row gap-3'>
                    <img src={data.album.images[0].url} className='w-12 h-12 rounded-lg ml-4'></img>
                    <div className='flex items-center'>
                        <p onClick={handleChange} className='text-white cursor-pointer hover:underline'>{data.name}</p>
                    </div>
                </div>
                <div className="flex flex-row items-center">
                        {
                            (playingData.name === data.name)
                                ?
                                    isPlaying
                                    ? 
                                        <button className='mr-3' onClick={() => {setPlay(false)}}><BsPauseFill className='text-[#EE5566] text-3xl' /></button>
                                    : 
                                        <button className='mr-3' onClick={() => {setPlay(true)}}><BsPlayFill className="text-[#EE5566] text-3xl" /></button>
                                :
                                focus
                                    ? <button onClick={handleFetch}><BsPlayFill className="text-[#EE5566] text-3xl mr-3" onClick={handleFetch} /></button>
                                    : ""
                        }
                    </div>
            </div>
        </div>
    )
}

export default HistoryCard