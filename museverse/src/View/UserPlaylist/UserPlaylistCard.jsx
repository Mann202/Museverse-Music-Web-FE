import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import { NavLink } from 'react-router-dom';
import { CiBookmarkRemove } from "react-icons/ci";


function UserPlaylistCard({ id, playlistID }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [hover, setHover]  = useState(false)
    const [isRemoved, setIsRemoved] = useState(false);
    const user = localStorage.getItem('user');
    const userJson = JSON.parse(user);
    const userID = userJson.user_id;

    useEffect(() => {
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
            axios(`https://api.spotify.com/v1/tracks/${id}?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data);
                setLoading(false)
            });
        }); 
    }, []);

    function handleHover() {
        setHover(true)
    }

    function handleBlur() {
        setHover(false)
    }

    function handleRemove() {
        axios.post(`http://127.0.0.1:8000/api/removeSong?user_id=${userID}&id=${playlistID}&song_id=${id}`)
        setIsRemoved(true);
    }


    if (isRemoved) {
        return null;
    }
    if(loading) return <Loading />
    return (
        <div onMouseEnter={handleHover} onMouseLeave={handleBlur} className='w-11/12 hover:bg-white hover:bg-opacity-20 p-2 rounded-lg'>
            <div className='flex justify-between'>
                <div className='flex flex-row gap-2'>
                    <img src={data.album.images[0].url} className='w-16 h-16 rounded-lg'/>
                    <div>
                        <NavLink to={`/track/${data.id}`} className='text-white font-medium hover:underline'>{data.name}</NavLink>
                        <div className='flex flex-row'>
                            {data.artists.map((item, index) => (
                                <NavLink to={`/artist/${item.id}`} className='text-white hover:underline'>
                                    {item.name}
                                    {index !== data.artists.length - 1 ? ', ' : ''}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='pt-4 pr-2'>
                    {
                        hover 
                        ?
                        <CiBookmarkRemove onClick={handleRemove} className='text-white text-3xl cursor-pointer'/>
                        :
                        ""
                    }
                </div>
            </div>
        </div>
    );
}

export default UserPlaylistCard;
