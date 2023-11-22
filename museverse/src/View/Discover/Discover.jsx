import { useEffect, useState } from "react";
import axios from "axios";

import { Spotify } from "../../API/Credentials";

import Headers from "../Header/Header";
import DiscoveryCard from "../Artists/Discovery/DiscoveryCard";
import SongCard from "./DiscoverSongCard";
import DiscoveryRecentlyPlayed from "./DiscoveryRecentlyPlayed";
import DiscoveryRecommendBaseArtist from './DiscoveryRecommendBaseArtist';
import DiscoveryCatelogy from "./DiscoveryCatelogy";

export default function Discover() {
    
    return(
        <div className="overflow-y-scroll h-screen">
            <Headers />
            <div className="flex items-center justify-center">
                <div className="w-[95%]">
                    <div>
                        <DiscoveryRecentlyPlayed />
                    </div>
                    <div>
                        <></>
                    </div>
                    {//<div>
                        //<DiscoveryRecommendBaseArtist />
                    //</div>
                    }
                    <div>
                        <DiscoveryCatelogy />
                    </div>
                </div>
            </div>
            <div className="bg-white bg-opacity-5 w-full h-40 flex justify-end pr-5 mt-10 pt-3">
                <p className="text-white">Museverse - Inspired by Spotify © 2023 Museverse</p>
            </div>
        </div>
    )
}