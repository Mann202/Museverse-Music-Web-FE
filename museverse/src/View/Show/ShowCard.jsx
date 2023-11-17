import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { BsDot, BsHeart, BsPlayFill, BsThreeDots, BsPauseFill } from 'react-icons/bs'

import { chuyenNgay } from '../Playlist/SplitNumber'

function ShowCard({
  index,
  num,
  id,
  name,
  duration,
  playingAlbumID,
  setPlayingAlbumID,
  setPlayingTrack,
  setPlay,
  play,
  isPlaying,
  playingData,
  AlbumData,
  publisher,
}) {
  const [focus, setFocus] = useState(false)
  const { albumID } = useParams()

  duration = duration * 0.000017
  const duration_minutes = Math.floor(duration)
  const duration_second = duration - duration_minutes
  const round_duration_second = Math.floor(duration_second * 60)

  if (round_duration_second < 10) {
    round_duration_second.toString()
    var round_duration_second_text = `0${round_duration_second}`
  }

  const tracks = []
  // const albumData = AlbumData.tracks.items
  // albumData.map((item) => tracks.push(item.uri))

  // function handleClick() {
  //   setPlayingTrack(tracks)
  //   setPlayingAlbumID(albumID) //
  //   setPlay(true)
  // }

  function handleFetch() {
    setPlay(true)
    // setPlayingAlbumID('')
    setPlayingTrack(tracks)
  }

  function handleClick() {
    setPlayingTrack(tracks)
    console.log('im here')
    setPlay(true)
  }

  return (
    <>
      <div
        className="flex items-center justify-between w-11/12 py-1 hover:bg-white/10 hover:bg-opacity-70 hover:rounded-lg"
        onMouseEnter={() => {
          setFocus(true)
        }}
        onMouseLeave={() => {
          setFocus(false)
        }}
      >
        <div className="flex ml-10">
          <div className="flex items-center ">
            {playingData.name === name ? (
              isPlaying ? (
                <button
                  className="-ml-2"
                  onClick={() => {
                    setPlay(false)
                  }}
                >
                  <BsPauseFill className="text-2xl text-white text-opacity-90" />
                </button>
              ) : (
                <button
                  className="-ml-2"
                  onClick={() => {
                    setPlay(true)
                  }}
                >
                  <BsPlayFill
                    className="text-2xl text-white text-opacity-90"
                    onClick={handleClick}
                  />
                </button>
              )
            ) : focus ? (
              <button
               onClick={handleFetch}
              >
                <BsPlayFill
                  className="-ml-1 text-2xl text-white text-opacity-90"
                  onClick={handleFetch}
                />
              </button>
            ) : (
              <p className="w-5 text-white text-opacity-50">{num}</p>
            )}
            <div className="ml-9">
              <h3 className="text-base font-medium text-white cursor-pointer text-opacity-90 hover:underline">
                {name.length > 50 ? name.slice(0, 50) + '...' : name}
              </h3>
              <p className="text-[#AFAFAF] text-opacity-90 font-medium text-base cursor-pointer w-full">
                {publisher}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pr-3">
          <span className="text-2xl text-white opacity-70">
            {focus ? <BsHeart className="visible" /> : <BsHeart className="invisible" />}
          </span>
          <p className="text-sm font-medium text-white text-opacity-50">
            {duration_minutes}:
            {round_duration_second < 10
              ? round_duration_second_text
              : round_duration_second}
          </p>
          <span className="text-2xl text-white opacity-70">
            {focus ? (
              <BsThreeDots className="visible" />
            ) : (
              <BsThreeDots className="invisible" />
            )}
          </span>
        </div>
      </div>
    </>
  )
}

export default ShowCard
