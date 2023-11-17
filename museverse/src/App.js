import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";

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
import Profile from "./View/Profile";
import Show from "./View/Show/Show";


function App() {
  const [playingTrack, setPlayingTrack] = useState('') //Lưu vào URI của track hoặc các track
  const [playingID, setPlayingID] = useState('') //Lưu vào Playlist ID của playlist đang được phát
  const [trackInAlbum, setTrackInAlbum] = useState(0) //Lưu vào thứ tự phát của album khi được bấm (dùng để queue bài hát)
  const [isPlaying, setIsPlaying] = useState(true) //Lấy trạng thái của thanh nghe nhạc (Đang nghe hay đã dừng)
  const [playingData, setPlayingData] = useState([]) //Lưu vào track đang được nghe
  const [play, setPlay] = useState([]) //Cài đặt resume và pause
  const [playingAlbumID, setPlayingAlbumID] = useState('') //Lưu vào album id đang nghe
  const [playingShowID, setPlayingShowID] = useState('') //Lưu vào album id đang nghe


  return (
      <div className="relative flex">
          <SideBar />
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 pb-40">
            <Routes>
                <Route path="/" element={<Discover />} />
                <Route path="/chart" element={<Chart setPlayingTrack={setPlayingTrack}/>} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/:catelogyID" element={<Catelogy setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum}/>} />
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/playlist/:playlistID" element={<Playlist setIsPlaying={setIsPlaying} setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying}/>} />
                <Route path="/artist/" element={<Artist />} />
                <Route path="/artist/:artistID" element={<Artist />} />
                <Route path="/artist/:artistID/discovery-all" element={<Discovery />} />
                <Route path="/artist/:artistID/related-artists" element={<Related />} />
                <Route path="/artist/:artistID/appear-on" element={<AppearOn />} />
                <Route path="/track" element={<Track setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID}/>}></Route>
                <Route path="/track/:trackID" element={<Track playingData={playingData} isPlaying={isPlaying} setPlay={setPlay} setPlayingTrack={setPlayingTrack}/>}></Route>
                <Route path="/album/" element={<Album />} />
                <Route path="/album/:albumID" element={<Album playingData={playingData} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying} setPlayingTrack={setPlayingTrack} play={play} setPlay={setPlay} playingAlbumID={playingAlbumID} setPlayingAlbumID={setPlayingAlbumID}/>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/show/:showID" element={<Show playingData={playingData} isPlaying={isPlaying} setPlayingTrack={setPlayingTrack} play={play} setPlay={setPlay} playingAlbumID={playingShowID} setPlayingAlbumID={setPlayingShowID}/>} />

            </Routes>
          </div>
        </div>
        <div className="fixed bottom-0 w-full">
            <Play playingData={playingData} play={play} isPlaying={isPlaying} setPlayingData={setPlayingData} playingTrack={playingTrack} trackInAlbum={trackInAlbum} setIsPlaying={setIsPlaying}/>
        </div>
      </div>
  );
}

export default App;
