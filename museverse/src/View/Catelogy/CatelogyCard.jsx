import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom' 
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';
import axios from 'axios';

import { Spotify } from '../../API/Credentials';

function CatelogyCard({ id, name, description, image, setPlayingTrack, setPlayingID, playingID, setTrackInAlbum, setQueueID }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()
  

  function changeRoute() {
    const path = `/playlist/${id}`
    navigate(path)
  }

  function handleClick() {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
        },
        data: 'grant_type=client_credentials',
        method: 'POST'
      })
      .then(response => {
        axios(`https://api.spotify.com/v1/playlists/${id}`, {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + response.data.access_token}
        })
        .then(response => {
          const tracks = response.data.tracks.items.map(album => album.track.uri);
          const tracksId = response.data.tracks.items.map(album => album.track.id);
          setQueueID(tracksId)
          setPlayingTrack(tracks);
          setPlayingID(id)
        })
        .catch(error => {
          console.error('Error fetching playlist tracks:', error);
        });
      })
      .catch(error => {
        console.error('Error fetching access token:', error);
      });
      setTrackInAlbum(0)
  }


  let cleanedDescription = description.replace(/<.*?>/g, '');

  return (
    <div
      className="bg-[#181818] h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 hover:bg-[#282828] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img src={image} className="rounded-xl w-40 h-40 mt-3" alt={name} onClick={changeRoute}/>
        { (playingID == id) ? 
          <div className={`absolute bottom-0 right-0 p-2 transtion-all overflow-hidden`}> 
            <ButtonPlay handleClick={handleClick} playingID={playingID} id={id}/>
          </div> : 
          <div className={isHovered ? `absolute bottom-0 right-0 p-2 transtion-all overflow-hidden` : "absolute bottom-0 right-0 hidden"}>
            <ButtonPlay handleClick={handleClick} playingID={playingID} id={id}/>
          </div>
        }
      </div>
      <div className="w-40 pb-4">
        <div>
          <h3 className="font-semibold text-base text-white" onClick={changeRoute}>
            {name.length > 15 ? name.slice(0, 15) + '...' : name}
          </h3>
          <p className="font-normal text-sm text-[#9898A6]" onClick={changeRoute}>
            {cleanedDescription.length > 40
              ? cleanedDescription.slice(0, 40) + '...'
              : cleanedDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

function ButtonPlay({handleClick, playingID, id}) {
  return (
    <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
      {(playingID==id) ? <BsPauseFill className="text-black text-3xl"/> : <BsPlayFill className="text-black text-3xl" onClick={handleClick}/>}
    </button>
  );
}

export default CatelogyCard;
