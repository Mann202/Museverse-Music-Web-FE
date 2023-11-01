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
import NewRelease from "./View/NewRelease/NewRelease";
import AllNewReleases from "./View/NewRelease/AllNewReleases";

function App() {
  const [playingTrack, setPlayingTrack] = useState('')
  const [playingID, setPlayingID] = useState('')
  const [currentPlay, setCurrentPlay] = useState('')
  const [trackInAlbum, setTrackInAlbum] = useState(0)
  
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
                <Route path="/playlist/:playlistID" element={<Playlist setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} playingID={playingID} currentPlay={currentPlay} setTrackInAlbum={setTrackInAlbum}/>} />
                <Route path="/artist/" element={<Artist />} />
                <Route path="/artist/:artistID" element={<Artist />} />
                <Route path="/artist/:artistID/discovery-all" element={<Discovery />} />
                <Route path="/artist/:artistID/related-artists" element={<Related />} />
                <Route path="/artist/:artistID/appear-on" element={<AppearOn />} />
                <Route path="/track" element={<Track setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID}/>}></Route>
                <Route path="/track/:trackID" element={<Track currentPlay={currentPlay}/>}></Route>
                <Route path="/album/" element={<Album />} />
                <Route path="/album/:albumID" element={<Album />} />
                <Route path="/newrelease/" element={<NewRelease />} />
                <Route path="/allnewrelease/" element={<AllNewReleases />} />
            </Routes>
          </div>
        </div>
        <div className="fixed bottom-0 w-full">
            <Play playingTrack={playingTrack} setCurrentPlay={setCurrentPlay} trackInAlbum={trackInAlbum}/>
        </div>
      </div>
  );
}

export default App;
