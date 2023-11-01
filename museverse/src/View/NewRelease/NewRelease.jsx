import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import Headers from '../Header/Header';
import NewReleases from './NewReleases';

const NewRelease = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API để lấy token
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(response => {
                const token = response.data.access_token;
                // Gọi Spotify Web API để lấy thông tin về album
                axios(`https://api.spotify.com/v1/browse/new-releases?country=VN`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => {
                        setData(response.data.albums)
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    });

    if (loading) {
        return <div><Loading /></div>
    }

    return (
        <div className="h-screen overflow-y-scroll flex flex-col w-full">
            <Headers bgColor='#eaafc8' />
            <div className="flex flex-col gap-10 h-1/4" style={{ background: `linear-gradient(#eaafc8, #654ea3)` }}>
                <div className='flex h-full items-center text-[90px] font-bold text-white ml-5'>Mới phát hành</div>
            </div>
            <div className="flex flex-col h-2/4" style={{ background: 'linear-gradient(#403267, #201934 )' }}>
                <div className='text-white text-xl font-bold mt-8 ml-5'>Những bản phát hành mới hay nhất</div>
            </div>
            <div style={{ background: 'linear-gradient(#201934, black )' }}>
                <NewReleases />
            </div>
        </div>
    );
}


export default NewRelease