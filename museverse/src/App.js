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

function App() {
  const [backGroundColorCatelogy, setBackgroundColorCatelogy] = useState('')

  return (
      <div className="relative flex">
          <SideBar />
        <div className="flex-1 flex flex-col bg-[#101010]">
          <div className="flex-1 pb-40">
          <Headers />
            <Routes>
                <Route path="/" element={<Discover />} />
                <Route path="/chart" element={<Chart />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/:catelogyID" element={<Catelogy />} />
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/playlist/:playlistID" element={<Playlist />} />
                <Route path="/artist/" element={<Artist />} />
                <Route path="/artist/:artistID" element={<Artist />} />
                <Route path="/artist/:artistID/discovery-all" element={<Discovery />} />
                <Route path="/artist/:artistID/related-artists" element={<Related />} />
                <Route path="/artist/:artistID/appear-on" element={<AppearOn />} />
            </Routes>
          </div>
          <div className="xl:sticky relative top-0 h-fit">
            <Play />
          </div>
        </div>
      </div>
  );
}

export default App;
