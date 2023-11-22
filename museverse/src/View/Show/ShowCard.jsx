import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  BsDot,
  BsHeart,
  BsPlayFill,
  BsThreeDots,
  BsPauseFill,
} from 'react-icons/bs';

import { chuyenDoiThoiGian, chuyenNgay, convertMsToMinSec } from '../Playlist/SplitNumber';

function ShowCard({
  index,
  image,
  num,
  id,
  name,
  duration,
  playingAlbumID,
  setPlayingAlbumID,
  setPlayingTrack,
  setPlay,
  play,
  description,
  isPlaying,
  playingData,
  AlbumData,
  duration_ms,
  release_date,
  publisher,
}) {
  const [focus, setFocus] = useState(false);
  const { albumID } = useParams();

  // Convert duration to minutes and seconds
  duration = duration * 0.000017;
  const duration_minutes = Math.floor(duration);
  const duration_second = duration - duration_minutes;
  const round_duration_second = Math.floor(duration_second * 60);

  let round_duration_second_text = round_duration_second < 10 ? `0${round_duration_second}` : round_duration_second.toString();

  const tracks = [];

  // Commented out code:
  // const albumData = AlbumData.tracks.items;
  // albumData.map((item) => tracks.push(item.uri));

  // Function to handle clicking on a track
  function handleFetch() {
    setPlay(true);
    // setPlayingAlbumID('');
    setPlayingTrack(tracks);
  }

  // Function to handle clicking on the play button
  function handleClick() {
    setPlayingTrack(tracks);
    console.log('im here');
    setPlay(true);
  }

  return (
    <>
      <NavLink to={`/episode/${id}`} className='flex flex-row gap-3'>
        <img src={image} className='rounded-lg w-40 h-40'></img>
        <div className='flex flex-col justify-between'>
          <div>
            <p className='text-white text-bold'>{name}</p>
            <p className='text-white text-opacity-70 text-sm'>{publisher}</p>
          </div>
          <div className='w-11/12'> 
            <p className='text-white text-sm text-opacity-90'>{description.length > 169 ? description.slice(0,169) + "..." : description}</p>
          </div>

          <div className=''>
          <PlayButton
          isPlaying={isPlaying}
          play={play}
          setPlay={setPlay}
          setPlayingTrack={setPlayingTrack}
          playingAlbumID={playingAlbumID}
          setPlayingAlbumID={setPlayingAlbumID}
          release_date={release_date}
          duration_ms={duration_ms}
          />
          </div>
        </div>
      </NavLink>
    </>
  );
}

function PlayButton({
  playingAlbumID,
  setPlayingAlbumID,
  data,
  setPlayingTrack,
  setPlay,
  play,
  release_date,
  duration_ms,
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
    <div className="flex flex-row gap-5">
      {showID === playingAlbumID ? (
        isPlaying ? (
          <button
            onClick={() => {
              setPlay(false)
            }}
            className="bg-[#EE5566] rounded-full w-10 h-10 flex justify-center items-center"
          >
            <BsPauseFill className="text-3xl text-black" />
          </button>
        ) : (
          <button
            onClick={() => {
              setPlay(true)
            }}
            className="bg-[#EE5566] rounded-full w-10 h-10 flex justify-center items-center"
          >
            <BsPlayFill className="text-3xl text-black" />
          </button>
        )
      ) : (
        <button
          onClick={handleClick}
          className="bg-[#EE5566] rounded-full w-10 h-10 flex justify-center items-center"
        >
          <BsPlayFill className="text-2xl text-black" />
        </button>
      )}
      <div className="flex items-center">
        <p className='text-white text-opacity-70'>{extractMonthYear(release_date)}</p>
      </div>
      <div className='flex'>
        <p className='text-white text-opacity-70 font-bold'>.</p>
      </div>
      <div className="flex items-center justify-center">
        <button>
          <p className='text-white text-opacity-70'>{convertMsToMinSec(duration_ms)}</p>
        </button>
      </div>
    </div>
  )
}

export function extractMonthYear(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

export default ShowCard;
