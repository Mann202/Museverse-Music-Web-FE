import { Route, Routes, Navigate } from "react-router-dom";
import Headers from "./Header/Header";
import SideBar from "./SideBar/SideBar";
import Discover from "./Discover/Discover";
import Play from "./Play/Play";
import NotFound from "./NotFound/NotFound";
import Chart from "./Chart/Chart";


function App() {
  return (
    <div className="relative flex">
      <SideBar />
      <div className="flex-1 flex flex-col bg-[#171719]">
        <Headers />
        <div className="flex-1 pb-40">
        <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/chart" element={<Chart />} />
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
