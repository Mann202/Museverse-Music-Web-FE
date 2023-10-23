import { Route, Routes, Navigate } from "react-router-dom";
import Headers from "./Header/Header";
import SideBar from "./SideBar/SideBar";
import Discover from "./Discover/Discover";
import Play from "./Play/Play";
import NotFound from "./NotFound/NotFound";
import Chart from "./Chart/Chart";
import Search from "./Search/Search";


function App() {
  return (
    <div className="relative flex">
      <SideBar />
      <div className="flex-1 flex flex-col bg-[#101010]">
        <Headers />
        <div className="flex-1 pb-40 mt-5 mx-10">
        <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/chart" element={<Chart />} />
              <Route path="/search" element={<Search />} />
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
