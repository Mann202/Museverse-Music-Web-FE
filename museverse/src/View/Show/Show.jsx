import axios from 'axios'
import ColorThief from 'colorthief'
import React, { useEffect, useRef, useState } from 'react'
import { BsHeart, BsPauseFill, BsPlayFill, BsThreeDots } from 'react-icons/bs'
import { useParams } from 'react-router-dom'

import { Spotify } from '../../API/Credentials'
import Loading from '../Loading/Loading'

import ShowAbout from './ShowAbout'
import ShowTrack from './ShowTrack'
import Headers from '../Header/Header'

const Show = ({
  playingAlbumID,
  setPlayingAlbumID,
  setPlayingTrack,
  setPlay,
  play,
  isPlaying,
  playingData,
}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backgroundColor, setBackgroundColor] = useState('')
  const [image, setImage] = useState('')
  const [dark, setDark] = useState(false)
  const { showID } = useParams()

  const imageRef = useRef(null)

  console.log(data, image, backgroundColor)

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
        const token = response.data.access_token
        axios(`https://api.spotify.com/v1/shows/${showID}`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
          .then((response) => {
            console.log(response.data)
            setData(response.data)
            setImage(response.data.images[0].url)
            setLoading(false)
          })
      })
  }, [showID])

  useEffect(() => {
    const colorThief = new ColorThief()
    const imageElement = imageRef.current

    const loadImage = async () => {
      try {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = image
        img.onload = () => {
          const color = colorThief.getColor(img)

          const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000

          if (brightness < 50) {
            setDark(true)
          }

          if (brightness > 160) {
            const darkenedColor = [
              Math.max(0, color[0] - 100),
              Math.max(0, color[1] - 100),
              Math.max(0, color[2] - 100),
            ]
            const hexColor = `#${darkenedColor[0]
              .toString(16)
              .padStart(2, '0')}${darkenedColor[1]
              .toString(16)
              .padStart(2, '0')}${darkenedColor[2].toString(16).padStart(2, '0')}`
            setBackgroundColor(hexColor)
          } else {
            const darkenedColor = [
              Math.max(0, color[0] - 15),
              Math.max(0, color[1] - 15),
              Math.max(0, color[2] - 15),
            ]
            const hexColor = `#${darkenedColor[0]
              .toString(16)
              .padStart(2, '0')}${darkenedColor[1]
              .toString(16)
              .padStart(2, '0')}${darkenedColor[2].toString(16).padStart(2, '0')}`
            setBackgroundColor(hexColor)
          }
        }
      } catch (error) {
        console.error('Lỗi tải hình ảnh:', error)
      }
    }

    loadImage()
  }, [image])

  if (loading) {
    return (
      <div >
        <Loading />
      </div>
    )
  }

  return (
    <div>
      <Headers bgColor={backgroundColor}/>
      <div className="flex flex-col w-full h-screen overflow-y-scroll" style={{ background: `linear-gradient(${backgroundColor}, black)` }}>
      <div style={{ background: `${backgroundColor}` }} className="flex flex-row gap-10">
        <div className="h-[22rem] flex items-center flex-row ml-7">
          <img src={data?.images[0]?.url} className="h-64 rounded-lg w-60"></img>
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <div>
            <p className="text-lg text-white capitalize font-medeium">
              Podcast
            </p>
            <div className="w-full overflow-hidden">
              <h1 className="whitespace-nowrap text-ellipsis overflow-hidden text-white font-bold text-[3vw]">
                {data?.name}
              </h1>
            </div>
            <h3 className="flex items-center text-xl text-white text-opacity-80 font-bold">
              {data?.publisher}
            </h3>
          </div>
        </div>
      </div>
      <div
        className="flex flex-row w-full pb-32 mt-10 gap-5"
      >
        
        <ShowTrack
          publisher={data?.publisher}
          id={showID}
          playingAlbumID={playingAlbumID}
          setPlayingAlbumID={setPlayingAlbumID}
          setPlayingTrack={setPlayingTrack}
          setPlay={setPlay}
          play={play}
          isPlaying={isPlaying}
          playingData={playingData}
          AlbumData={data}
        />
        <ShowAbout desc={data?.description} />
      </div>
    </div>
    </div>
  )
}

export default Show
