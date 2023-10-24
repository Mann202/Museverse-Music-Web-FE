import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";

import Headers from "./Header/Header";
import SideBar from "./SideBar/SideBar";
import Discover from "./Discover/Discover";
import Play from "./Play/Play";
import NotFound from "./NotFound/NotFound";
import Chart from "./Chart/Chart";
import Search from "./Search/Search";
import Catelogy from "./Catelogy/Catelogy";
import Playlist from "./Playlist/Playlist";


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
