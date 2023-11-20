import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import SpotifyPlayer from "react-spotify-web-playback";
import { MdQueueMusic } from 'react-icons/md'
import { AiOutlineExpandAlt } from 'react-icons/ai'
import { VscDebugRestart } from 'react-icons/vsc'
import { NavLink, Navigate, useLocation, useNavigate, useNavigation } from "react-router-dom";
import { Spotify } from "../../API/Credentials";
import Loading from "../Loading/Loading";
import Cookies from "js-cookie";
import PlayArtist from "./PlayArtist";
import Swal from "sweetalert2";
import { LoggedContext } from "../Login-SignUp/LoggedContext";

const Play = ({ playingTrack, trackInAlbum, setIsPlaying, setPlayingData, isPlaying, playingData, play }) => {

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const { logged, setLogged } = useContext(LoggedContext);
  const location = useLocation();
  const checkLogged = (async () => {
    if (!localStorage.getItem('user')) {

    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log("user", user.user_id);
      let result = await fetch("http://localhost:8000/api/checkrole", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      })
      result = await result.json()
      console.log("result", result.role_id);
      if (result.role_id == 3) //checkrole
      {
      }
    }

  })
  checkLogged();

  useEffect(() => {
    if (location.pathname === '/signin' || location.pathname === '/signup') {
      Swal.close();
    }
  }, [location]);
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

  if (!token) {
    return <p>Redirecting to Spotify...</p>;
  }

  if (loading) return <Loading />;

  if (playingTrack.length == 0) return "";

  if (!logged) {
    (async () => {
      const result = await Swal.fire({
        background: "#1F1F22",
        color: '#EE5566',
        title: "Start listening by signing in to our website",
        confirmButtonText: "Sign in",
        confirmButtonColor: '#EE5566',
        showDenyButton: true,
        denyButtonText: `Sign Up`,
        denyButtonColor: 'black',
        showCancelButton: false
      });

      if (result.isConfirmed) {
        navigate('/signin');
      } else if (result.isDenied) {
        navigate('/signup');
      }

      Swal.close();
    })();
  }
  if (!logged)
    return "";

  return (
    <div className="flex flex-row">
      <div div className="w-3/12 bg-black" >
        {
          (playingData.length == 0)
            ? <p className="text-white">Loading</p>
            :
            <div className="w-full h-full">
              {
                (playingData.name === '') ? "" :
                  <div className="flex flex-row gap-2 w-full h-full">
                    <div className="flex items-center pl-2">
                      <img src={playingData.image} className="w-16 h-16 rounded-lg"></img>
                    </div>
                    <div className="flex items-start flex-col mt-1">
                      <NavLink to={`/track/${playingData.id}`} className="text-white font-semibold hover:underline">
                        {playingData.name.length > 40
                          ? playingData.name.substring(0, 40) + "..."
                          : playingData.name}
                      </NavLink>
                      <PlayArtist playingData={playingData} />
                    </div>
                  </div>
              }
            </div>
        }
      </div >
      <div className="w-10/12">
        <SpotifyPlayer
          hideAttribution={true}
          styles={{
            bgColor: "#000",
            sliderHandleColor: "#fff",
            color: "#EE5566",
            loaderColor: "#EE5566",
            sliderColor: "#EE5566",
            savedColor: "#fff",
            trackArtistColor: "#000",
            trackNameColor: "#000",
          }}
          offset={trackInAlbum}
          hideCoverArt={true}
          token={token}
          play={play}
          uris={playingTrack}
          callback={(state) => {
            setIsPlaying(state.isPlaying)
            setPlayingData(state.track)
          }}
        />
      </div>
      <div className="w-2/12 bg-black">
        <div className="flex items-center gap-5 justify-center w-full h-full">
          <button className="text-[#EE5566] font-semibold text-3xl">
            <VscDebugRestart />
          </button>
          <button className="text-[#EE5566] font-semibold text-4xl">
            <MdQueueMusic />
          </button>
          <button className="text-[#EE5566] font-semibold text-3xl">
            <AiOutlineExpandAlt />
          </button>
        </div>
      </div>
    </div >

  );
};

export default Play;
