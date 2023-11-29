import axios from "axios";
import { useEffect, useState } from "react";
import { Spotify } from "../../API/Credentials";
import CardChart from "./ChartCard";
import Loading from "../Loading/Loading";
import Headers from "../Header/Header";

export default function Chart({setPlayingTrack}) {
    const [token, setToken] = useState('')
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(true)

    const ClientID = Spotify.ClientID
    const ClientSecret = Spotify.ClientSecret

    useEffect(() => {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(ClientID + ':' + ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
        .then(response => {
            setToken(response.data.access_token);
            axios('https://api.spotify.com/v1/playlists/37i9dQZEVXbLdGSmz6xilI?market=VN', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.tracks.items); 
                setLoading(false)
            })
        })
    }, []);

    if(loading) {
        return <div><Loading /></div>
    }
    return (
            <div>
                <Headers />
                <div className="bg-transparent flex flex-col gap-5 h-screen mt-3 pb-40 overflow-y-scroll mx-7">
                    <HeaderChart />
                {
                    data.map(item => {
                        return(
                            <CardChart img={item.track.album.images[0].url}
                                id={item.track.id}
                                name={item.track.name}
                                uri={item.track.uri}
                                artist={item.track.artists}
                                duration_ms={item.track.duration_ms}
                                setPlayingTrack={setPlayingTrack}
                            />
                        )
                    })
                }
                </div>
            </div>
        )
}

function HeaderChart() {
    return(
        <>
            <p className="text-[#EE5566] font-semibold text-xl">Top Chart</p> 
            <div className="flex felx-row justify-between w-full h-28 pl-3">
                    <div className="flex flex-row gap-8 w-96">
                        <div>
                            <br></br>
                            <h3 className="text-[#939393] font-medium text-sm">
                                # Song
                            </h3>
                        </div>
                    </div>
                    <div>
                        <br></br>
                        <p className="text-[#939393] font-medium text-sm"># Duration</p>
                    </div>
                    <div className="flex flex-row gap-5 mr-5">
                        <button className="rounded-full flex justify-center items-center w-10 h-10">
                        </button>
                        <button className="w-10 h-10 rounded-full flex justify-center items-center">
                        </button>
                    </div>
                </div>
        </>
    )
}