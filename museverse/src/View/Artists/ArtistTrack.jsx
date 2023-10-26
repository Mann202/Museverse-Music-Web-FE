import React, {useEffect, useState} from 'react'
import axios from 'axios';

import { Spotify } from '../../API/Credentials';
import ArtistTrackCard from './ArtistTrackCard';

function ArtistTrack({id}) {
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)

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
            setToken(response.data.access_token);
            // Gọi API Spotify ngay sau khi nhận được token
            axios(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.tracks); // Lưu dữ liệu từ API vào state
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [setToken, setData]);

    return (
        <div className='flex justify-center'>
           <div className='w-full flex flex-col justify-center ml-10 mt-5'>
            <h1 className="text-[#EE5566] text-opacity-90 font-semibold text-lg">Popular</h1>
                <div className='mt-5'>
                {
                    data.map((item, index) => (
                        <ArtistTrackCard 
                        index={index}
                        id={item.id}
                        image={item.album.images[0].url}
                        name={item.album.name}
                        duration ={item.duration_ms}
                        release_date = {item.album.release_date}
                        />
                    ))
                } 
                </div>
           </div>
        </div>
    )
}

export default ArtistTrack