import { useEffect, useState } from "react";
import axios from "axios";

import { Spotify } from "../../API/Credentials";

import Headers from "../Header/Header";
import DiscoveryCard from "../Artists/Discovery/DiscoveryCard";
import SongCard from "./DiscoverSongCard";
import DiscoveryRecentlyPlayed from "./DiscoveryRecentlyPlayed";
import DiscoveryRecommendBaseArtist from './DiscoveryRecommendBaseArtist';
import DiscoveryCatelogy from "./DiscoveryCatelogy";

export default function Discover({setPlayingTrack, setPlayingID, playingID, setTrackInAlbum}) {

    let userID = 0
    const user = localStorage.getItem('user')
    if (user != null) {
        const userJson = JSON.parse(user);
        userID = userJson.user_id;
    }

    if(userID == 0) {
        return(
            <div>
            <Headers />
            <div className="overflow-y-scroll h-screen w-screen">
                <div className="flex items-center justify-center">
                    <div className="w-full">
                        <div>
                            <></>
                        </div>
                        {//<div>
                            //<DiscoveryRecommendBaseArtist />
                        //</div>
                        }
                        <div className="flex justify-center">
                            <DiscoveryCatelogy setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum}/> 
                        </div>
                    </div>
                </div>
                <div className="bg-white bg-opacity-5 w-full h-40 flex justify-end pr-5 mt-10 pt-3">
                    <p className="text-white">Museverse - Inspired by Spotify © 2023 Museverse</p>
                </div>
            </div>
        </div>
        )
    }
    
    return(
        <div>
            <Headers />
            <div className="overflow-y-scroll h-screen">
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
                            <DiscoveryCatelogy setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} playingID={playingID} setTrackInAlbum={setTrackInAlbum}/>
                        </div>
                    </div>
                </div>
                <div className="bg-white bg-opacity-5 w-full h-40 flex justify-end pr-5 mt-10 pt-3">
                    <p className="text-white">Museverse - Inspired by Spotify © 2023 Museverse</p>
                </div>
            </div>
        </div>
    )
}