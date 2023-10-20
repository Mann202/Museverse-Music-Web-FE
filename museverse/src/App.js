import { Route, Routes, Navigate } from "react-router-dom";
import Headers from "./Header/Header";
import SideBar from "./SideBar/SideBar";
import Discover from "./Discover/Discover";
import Play from "./Play/Play";
import NotFound from "./NotFound/NotFound";


function App() {
  return (
    <div className="relative flex">
      <SideBar />
      <div className="flex-1 flex flex-col bg-[#101010]">
        <Headers />
        <div className="flex-1 h-fit pb-40">
          <Routes>
            <Route path="/" element={<Discover />} />
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
