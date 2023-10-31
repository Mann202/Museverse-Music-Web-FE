import React, { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { spotifyApi } from "react-spotify-web-playback";
import Loading from "../Loading/Loading";
import Cookies from "js-cookie";

const Play = ({ playingTrack, setCurrentPlay, trackInAlbum }) => {
  const [token, setToken] = useState(null);
  const [trackUri, setTrackUri] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTrackUri(playingTrack);
  }, [playingTrack]);

  useEffect(() => {
    const hashParams = {};
    const regex = /([^&;=]+)=?([^&;]*)/g;
    const hash = window.location.hash.substring(1);

    let match;
    while ((match = regex.exec(hash)) !== null) {
      hashParams[match[1]] = decodeURIComponent(match[2]);
    }

    if (hashParams.access_token) {
      // Lưu token vào cookie với tên "spotifyToken" và hạn sử dụng là 1 giờ (hoặc thời gian mong muốn)
      Cookies.set("spotifyToken", hashParams.access_token, { expires: 1 / 24 }); // 1 giờ
      setToken(hashParams.access_token);
      setLoading(false);
    } else {
      // Kiểm tra xem có token trong cookie không
      const storedToken = Cookies.get("spotifyToken");
      if (storedToken) {
        setToken(storedToken);
        setLoading(false);
      } else {
        window.location.href = `https://accounts.spotify.com/authorize?client_id=378d7d72f2b14567b5a6efa04d922948&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-private%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-read-recently-played&response_type=token`;
      }
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (token && trackUri.length > 0) {
        spotifyApi.getPlaybackState(token, trackUri[0]).then((data) => {
          console.log(data)
          setCurrentPlay(data.item.id);
        });
      }
    }, 10000); 

    return () => clearInterval(intervalId);
  }, [trackUri]);

  if (!token) {
    return <p>Redirecting to Spotify...</p>;
  }

  if (loading) return <Loading />;
  return (
    <div>
      {trackUri.length === 0 ? (
        ""
      ) : (
        <SpotifyPlayer
          hideAttribution={true}
          styles={{
            bgColor: "#000",
            sliderHandleColor: "#fff",
            color: "#EE5566",
            loaderColor: "#EE5566",
            sliderColor: "#EE5566",
            savedColor: "#fff",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
          }}
          offset={trackInAlbum}
          token={token}
          play={true}
          uris={trackUri}
        />
      )}
    </div>
  );
};

export default Play;
