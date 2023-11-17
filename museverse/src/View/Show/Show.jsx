import axios from 'axios'
import ColorThief from 'colorthief'
import React, { useEffect, useRef, useState } from 'react'
import { BsHeart, BsPauseFill, BsPlayFill, BsThreeDots } from 'react-icons/bs'
import { useParams } from 'react-router-dom'

import { Spotify } from '../../API/Credentials'
import Loading from '../Loading/Loading'

import ShowAbout from './ShowAbout'
import ShowTrack from './ShowTrack'

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
        const token = response.data.access_token
        // Gọi Spotify Web API để lấy thông tin về album
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
          
          .catch((error) => {
            console.error(error)
          })
      })
      .catch((error) => {
        console.error(error)
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
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-screen pb-20 overflow-y-scroll">
      <div style={{ background: `${backgroundColor}` }} className="flex flex-row gap-10">
        <div className="h-[22rem] flex items-center flex-row ml-7">
          <img src={data?.images[0]?.url} className="h-64 rounded-full w-60"></img>
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <div>
            <p className="text-lg text-white capitalize font-medeium">
              {data?.album_type}
            </p>
            <div className="w-full overflow-hidden">
              <h1 className="whitespace-nowrap text-ellipsis overflow-hidden text-white font-bold text-[3vw]">
                {data?.name}
              </h1>
            </div>
            <h3 className="flex items-center text-base text-white text-opacity-80 font-base">
              {data?.publisher}
            </h3>
          </div>
        </div>
      </div>
      <div
        style={{ background: `linear-gradient(${backgroundColor}, black)` }}
        className="flex flex-col w-full pt-4 pb-32"
      >
        <ShowAbout desc={data?.description} />
        <PlayButton
          isPlaying={isPlaying}
          play={play}
          setPlay={setPlay}
          setPlayingTrack={setPlayingTrack}
          playingAlbumID={playingAlbumID}
          setPlayingAlbumID={setPlayingAlbumID}
          data={data}
        />
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
      </div>
    </div>
  )
}

function PlayButton({
  playingAlbumID,
  setPlayingAlbumID,
  data,
  setPlayingTrack,
  setPlay,
  play,
  isPlaying,
}) {
  const { showID } = useParams()

  function handleClick() {
    const track = []
    console.log(data)
    // const tracksData = data.items
    // setPlayingAlbumID(showID)
    // tracksData.forEach((item) => {
    //   track.push(item.uri)
    // })
    // setPlayingTrack(track)
  }

  return (
    <div className="flex flex-row gap-5 ml-10 -mt-5">
      {showID === playingAlbumID ? (
        isPlaying ? (
          <button
            onClick={() => {
              setPlay(false)
            }}
            className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center"
          >
            <BsPauseFill className="text-3xl text-black" />
          </button>
        ) : (
          <button
            onClick={() => {
              setPlay(true)
            }}
            className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center"
          >
            <BsPlayFill className="text-3xl text-black" />
          </button>
        )
      ) : (
        <button
          onClick={handleClick}
          className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center"
        >
          <BsPlayFill className="text-3xl text-black" />
        </button>
      )}
      <div className="flex items-center">
        <BsHeart className="text-[#AFAFAF] text-3xl" />
      </div>
      <div className="flex items-center justify-center">
        <button>
          <BsThreeDots className="text-[#AFAFAF] text-xl" />
        </button>
      </div>
    </div>
  )
}

export default Show
