import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import Headers from '../Header/Header';
import NewReleases from './NewReleases';
// import PlaylistCard from '../Playlist/PlaylistCard';
// import { useParams } from 'react-router-dom';
// import { formatNumber } from '../Playlist/SplitNumber';
import CatelogyCard from '../Catelogy/CatelogyCard';

const NewRelease = ({ setPlayingTrack, setPlayingID, playingID, setTrackInAlbum, setQueueID }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    const ClientID = Spotify.ClientID;
    const ClientSecret = Spotify.ClientSecret;

    const [playlistID, setplaylistID] = useState('37i9dQZF1DX5G3iiHaIzdf');
    useEffect(() => {
        // Gọi API để lấy token
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
                // Gọi API Spotify ngay sau khi nhận được token
                axios(`https://api.spotify.com/v1/playlists/${playlistID}?market=VN`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + response.data.access_token
                    }
                })
                    .then(json => {
                        setData(json.data)
                        setLoading(false)                        
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    }, [playlistID, setToken, setData]);

    if (loading) {
        return <div><Loading /></div>
    } else
        console.log("get playlist success", data.id);


    return (
        <div className="h-screen overflow-y-scroll flex flex-col w-full pb-20">
            <Headers bgColor='#eaafc8' />
            <div className="flex flex-col gap-10 h-1/4" style={{ background: `linear-gradient(#eaafc8, #654ea3)` }}>
                <div className='flex h-full items-center text-[90px] font-bold text-white ml-5'>New Release</div>
            </div>
            <div className="flex flex-col h-2/4" style={{ background: 'linear-gradient(#403267, #201934 )' }}>
                <div className='text-[#EE5566] text-xl font-bold mt-8 ml-5'>The latest and greatest releases</div>
                <div className='mt-5 ml-5'>
                    <CatelogyCard
                        id={data.id}
                        name={data.name}
                        description={data.description}
                        image={data.images[0].url}
                        setPlayingTrack={setPlayingTrack}
                        setPlayingID={setPlayingID}
                        playingID={playingID}
                        setTrackInAlbum={setTrackInAlbum}
                        setQueueID={setQueueID}
                    />
                </div>

            </div>
            <div style={{ background: 'linear-gradient(#201934, black )' }}>
                <NewReleases />
            </div>
        </div>
    );
}


export default NewRelease