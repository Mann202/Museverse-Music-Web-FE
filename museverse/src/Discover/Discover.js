import { useEffect } from "react";
import SongCard from "./SongCard";

export default function Discover() {

    const axios = require('axios');

    return(
        <div className="flex flex-wrap sm:justify-start justify-center items-center gap-8 pt-12 pl-5 overflow-y-scroll h-screen">
            <SongCard />
            <SongCard />
            <SongCard />
            <SongCard />
            <SongCard />
            <SongCard />
            <SongCard />
            <SongCard />
            <SongCard />
        </div>
    )
}