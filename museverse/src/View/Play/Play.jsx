import React, { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Loading from "../Loading/Loading";

const Play = ({playingTrack}) => {
  const [token, setToken] = useState(null);
  const [trackUri, setTrackUri] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTrackUri(playingTrack)
  }, [playingTrack])

  useEffect(() => {
    const hashParams = {};
    const regex = /([^&;=]+)=?([^&;]*)/g;
    const hash = window.location.hash.substring(1);

    let match;
    while ((match = regex.exec(hash)) !== null) {
      hashParams[match[1]] = decodeURIComponent(match[2]);
    }

    if (hashParams.access_token) {
      setToken(hashParams.access_token);
      setLoading(false)
    } else {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=378d7d72f2b14567b5a6efa04d922948&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-private%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-read-recently-played&response_type=token`;
    }
  }, []);

  if (!token) {
    return <p>Redirecting to Spotify...</p>;
  }

  if(loading) return <Loading />
  return (
    <div>
      {(trackUri.length == 0) ? "" : 
    
        <SpotifyPlayer 
        hideAttribution={true}
        styles={{
          bgColor: '#333',
          color: '#fff',
          loaderColor: '#fff',
          sliderColor: '#EE5566',
          savedColor: '#fff',
          trackArtistColor: '#ccc',
          trackNameColor: '#fff',
        }}
        token={token}
        showSaveIcon
        play={true}
        uris={trackUri}
      />}
    </div>
  )
};

export default Play;
