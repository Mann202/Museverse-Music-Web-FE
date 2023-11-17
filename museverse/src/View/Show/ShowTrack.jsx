import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Spotify } from '../../API/Credentials'
import { BsFillClockFill } from 'react-icons/bs'
import Loading from '../Loading/Loading'
import ShowCard from './ShowCard'

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
    // Gọi API để lấy token
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
        // Gọi API Spotify ngay sau khi nhận được token
        axios(`https://api.spotify.com/v1/shows/${id}/episodes?limit=50`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + response.data.access_token,
          },
        })
          .then((json) => {
            setData(json.data?.items) // Lưu dữ liệu từ API vào state
            setLoading(false)
          })
          .catch((error) => {
            console.error(error)
            setLoading(false)
          })
      })
      .catch((error) => {
        console.error(error)
      })
  }, [setToken, setData])

  if (loading) {
    return <Loading />
  }

  console.log(data)

  return (
    <div className="flex my-4 justify-evenly">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="text-[#AFAFAF] text-opacity-90 text-bold text-xl flex items-center justify-between w-11/12">
          <div className="flex ml-10">
            <span>#</span>
            <span className="ml-10">Tiêu đề</span>
          </div>
          <div className="flex gap-10 mr-14">
            <span>
              <BsFillClockFill />
            </span>
          </div>
        </div>
        {data?.map((item, index) => (
          <ShowCard
            key={index}
            id={item.id}
            num={index + 1}
            publisher={publisher}
            name={item.name}
            duration={item.duration_ms}
            setPlayingTrack={setPlayingTrack}
            setPlay={setPlay}
            play={play}
            isPlaying={isPlaying}
            playingData={playingData}
            AlbumData={AlbumData}
          />
        ))}
      </div>
    </div>
  )
}

export default ShowTrack
