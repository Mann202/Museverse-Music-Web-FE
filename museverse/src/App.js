import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";


import Headers from "./View/Header/Header";
import SideBar from "./View/SideBar/SideBar";
import Discover from "./View/Discover/Discover";
import Play from "./View/Play/Play"
import NotFound from './View/NotFound/NotFound'
import Chart from "./View/Chart/Chart";
import Search from "./View/Search/Search";
import Catelogy from "./View/Catelogy/Catelogy";
import Playlist from "./View/Playlist/Playlist";
import Artist from "./View/Artists/Artists";
import Discovery from "./View/Artists/Discovery/Discovery";
import Related from "./View/Artists/Related";
import AppearOn from "./View/Artists/AppearOn/AppearOn";
import Track from "./View/Track/Track";
import Album from "./View/Album/Album";
import AllAnotherAlbum from "./View/Album/AllAnotherAlbum";
import NewRelease from "./View/NewRelease/NewRelease";
import AllNewReleases from "./View/NewRelease/AllNewReleases";
import Profile from "./View/Profile/Profile";
import SignIn from "./View/Login-SignUp/SignIn";
import SignUp from "./View/Login-SignUp/SignUp";
import { LoggedContext } from './View/Login-SignUp/LoggedContext';
import Show from "./View/Show/Show";
import Episode from "./View/Episode/Episode";
import History from "./History/History";
import FollowedArtist from "./View/FollowedArtist/FollowedArtist";
import Lyric from "./View/Lyric/Lyric";
import Queue from "./View/Queue/Queue";
import LikedTrack from "./View/LikedTrack/LikedTrack";
import axios from "axios";
import Cookies from "js-cookie";
import UserPlaylist from "./View/UserPlaylist/UserPlaylist";
import SoldAlbum from "./View/SoldAlbum/SoldAlbum";
import SoldAlbumDetail from "./View/SoldAlbum/SoldAlbumDetail";
import ShoppingCart from "./View/SoldAlbum/ShoppingCart";
import CheckOut from "./View/SoldAlbum/CheckOut";

function App() {
  const [playingTrack, setPlayingTrack] = useState('') //Lưu vào URI của track hoặc các track
  const [queue, setQueue] = useState('')
  const [status, setStatus] = useState([])
  const [next, setNext] = useState(false)
  const [a, setA] = useState([])
  if(a.length === 0 && status.length > 0) {
    setA(status)
  }

  useEffect(() => {
    if(a.length > 0 && status.length > 0) {
      if(a[0].name != status[0].name && queue != '') {
        setPlayingTrack(queue)
        setNext(true)
        setQueue('')
      }
    }
  }, [status])
  
  const [playingID, setPlayingID] = useState('') //Lưu vào Playlist ID của playlist đang được phát
  const [trackInAlbum, setTrackInAlbum] = useState(0) //Lưu vào thứ tự phát của album khi được bấm (dùng để queue bài hát)
  const [isPlaying, setIsPlaying] = useState(true) //Lấy trạng thái của thanh nghe nhạc (Đang nghe hay đã dừng)
  const [playingData, setPlayingData] = useState([]) //Lưu vào track đang được nghe
  const [play, setPlay] = useState([]) //Cài đặt resume và pause
  const [playingAlbumID, setPlayingAlbumID] = useState('') //Lưu vào album id đang nghe
  const { logged } = useContext(LoggedContext)
  const [progressMs, setProgressMs] = useState(0) //Luu vao thoi gian nghe nhac
  const [device, setDevice] = useState('')
  const [repeat, isRepeat] = useState('')
  const [ids, setIDs] = useState([])

  let userID = 0
  const user = localStorage.getItem('user')
  if(user != null) {
    const userJson = JSON.parse(user);
    console.log(userJson.user_id)
    userID = userJson.user_id;
  }

  useEffect(() => {
    if (playingData.length != 0 && playingData.id !== "") {
      axios.post(`http://127.0.0.1:8000/api/history`, {
        user_id: userID,
        track: playingData.id
      })
    }
  }, [playingData, userID]);

  return (
      <div className="relative flex">
          {logged ? <SideBar /> : ""}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 pb-40">
            <Routes>
                <Route path="/" element={<Discover />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/:searching" element={<Search setPlay={setPlay} setPlayingTrack={setPlayingTrack} isPlaying={isPlaying} playingData={playingData}/>} />
                <Route path="/catelogy/:catelogyID" element={<Catelogy setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum}/>} />
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/playlist/:playlistID" element={<Playlist setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying}/>} />
                <Route path="/artist/" element={<Artist />} />
                <Route path="/artist/:artistID" element={<Artist />} />
                <Route path="/artist/:artistID/discovery-all" element={<Discovery />} />
                <Route path="/artist/:artistID/all-albums" element={<AllAnotherAlbum />} />
                <Route path="/artist/:artistID/related-artists" element={<Related />} />
                <Route path="/artist/:artistID/appear-on" element={<AppearOn />} />
                <Route path="/chart/" element={<Chart setPlayingTrack={setPlayingTrack} />} />
                <Route path="/track" element={<Track setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID}/>}></Route>
                <Route path="/track/:trackID" element={<Track playingData={playingData} isPlaying={isPlaying} setPlay={setPlay} setPlayingTrack={setPlayingTrack}/>}></Route>
                <Route path="/album/" element={<Album />} />
                <Route path="/album/:albumID" element={<Album playingData={playingData} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} setPlayingTrack={setPlayingTrack} play={play} setPlay={setPlay} playingAlbumID={playingAlbumID} setPlayingAlbumID={setPlayingAlbumID}/>} />
                <Route path="/newrelease/" element={<NewRelease />} />
                <Route path="/allnewrelease/" element={<AllNewReleases />} />
                <Route path="/followedArtists" element={<FollowedArtist />} />
                <Route path="/history" element={<History setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying}/>} />
                <Route path="/track/lyric" element={<Lyric playingData={playingData} setProgressMs={setProgressMs} isPlaying={isPlaying} progressMs={progressMs} device={device}/>} />
                <Route path="/queue/" element={<Queue setIDs={setIDs} ids={ids} queue={queue} next={next} setNext={setNext} playingData={playingData} playingTrack={playingTrack} setQueue={setQueue} setPlayingTrack={setPlayingTrack} device={device}/>} />
                <Route path="/likedTracks/" element={<LikedTrack setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying}/>} />
                <Route path="/user-playlist/:playlistID" element={<UserPlaylist />} />
                <Route path="/albums/"element={<SoldAlbum/>}/>
                <Route path="/episode/:episodeID" element={<Episode playingData={playingData} isPlaying={isPlaying} setPlay={setPlay} setPlayingTrack={setPlayingTrack}/>} />
                <Route path="/albums/"element={<SoldAlbum/>}/>
                <Route path="/albumsdetails/:album_phys_id"element={<SoldAlbumDetail/>}/>
                <Route path="/shoppingcart/"element={<ShoppingCart/>}/>
                <Route path="/shoppingcart/checkout/"element={<CheckOut/>}/>

            </Routes>
          </div>
        </div>
    <div className="relative flex">
      <div className="fixed bottom-0 w-full">
        <Play setProgressMs={setProgressMs} setDevice={setDevice} playingData={playingData} play={play} isPlaying={isPlaying} setPlayingData={setPlayingData} playingTrack={playingTrack} trackInAlbum={trackInAlbum} setIsPlaying={setIsPlaying} />
      </div>
    </div>
    </div>
  );
}

export default App;
