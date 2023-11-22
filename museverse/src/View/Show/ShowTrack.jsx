import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Spotify } from '../../API/Credentials'
import { BsFillClockFill } from 'react-icons/bs'
import Loading from '../Loading/Loading'
import ShowCard from './ShowCard'
import { NavLink } from 'react-router-dom'

function ShowTrack({
  id,
  publisher,
  playingAlbumID,
  setPlayingAlbumID,
  setPlayingTrack,
  setPlay,
  play,
  isPlaying,
  playingData,
  AlbumData,
}) {
  const [token, setToken] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret),
      },
      data: 'grant_type=client_credentials',
      method: 'POST',
    })
      .then((response) => {
        setToken(response.data.access_token)
        axios(`https://api.spotify.com/v1/shows/${id}/episodes?limit=50`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + response.data.access_token,
          },
        })
          .then((json) => {
            setData(json.data?.items) 
            setLoading(false)
          })
      })
  }, [setToken, setData])

  if (loading) {
    return <Loading />
  }

  console.log(data)

  return (
    <div className="flex justify-evenly w-10/12">
      <div className="flex flex-col">
        <div className="text-white font-bold text-2xl flex">
          <div className="flex">
            <span className="ml-10">All Episodes</span>
          </div>
        </div>
        <div className='w-full flex flex-col gap-y-6 pl-11 pt-3'>
        {data?.map((item, index) => (
          <ShowCard
            key={index}
            image={item.images[0].url}
            id={item.id}
            num={index + 1}
            description={item.description}
            publisher={publisher}
            duration_ms={item.duration_ms}
            name={item.name}
            duration={item.duration_ms}
            setPlayingTrack={setPlayingTrack}
            setPlay={setPlay}
            play={play}
            release_date={item.release_date}
            isPlaying={isPlaying}
            playingData={playingData}
            AlbumData={AlbumData}
          />
        ))}
        </div>
      </div>
    </div>
  )
}

export default ShowTrack
