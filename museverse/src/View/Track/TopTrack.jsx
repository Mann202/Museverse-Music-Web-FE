import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import ArtistTrackCard from '../Artists/ArtistTrackCard'
import { NavLink } from 'react-router-dom';

function TopTrack({id, trackData}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(5)

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
    }, []);

    if(loading) return <div><Loading /></div>

  return (
    <div className='mt-10 ml-10'>
        <div>
            <div className='flex flex-row gap-2'>
                <div className='flex items-end'>
                    <h3 className='text-white text-opacity-90 text-lg'>Top track of </h3>
                </div>
                <NavLink to={`/artist/${trackData.artists[0].id}`} className='text-white text-opacity-95 text-2xl hover:underline'>{trackData.artists[0].name}</NavLink>
            </div>
            <div className='flex flex-row justify-center mt-5'>
                <div className='w-11/12'>
                    {
                            data.slice(0, limit).map((item, index) => (
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
            <p onClick={() => {setLimit(limit+5)}} className={`text-white text-opacity-80 ml-14 mt-5 ${(limit < data.length) ? "" : "hidden"}`}>Show more</p>
        </div>
    </div>
  )
}

export default TopTrack