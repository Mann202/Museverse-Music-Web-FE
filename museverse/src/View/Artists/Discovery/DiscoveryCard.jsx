import React, {useEffect, useState} from 'react'
import axios from 'axios';

import { Spotify } from '../../../API/Credentials';
import {AiOutlineClockCircle} from 'react-icons/ai'
import { convertMsToMinSec } from '../../Playlist/SplitNumber';
import { NavLink } from 'react-router-dom';

function DiscoveryCard({id}) {
    const [data, setData] = useState([])
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
            const token = response.data.access_token;
            // Gọi Spotify Web API để lấy thông tin về nghệ sĩ
            axios(`https://api.spotify.com/v1/albums/${id}/tracks?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data.items)
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [id]);

    console.log(data)

    if(loading) return <div>Loading</div>

    return (
        <div>
            <div className="flex flex-row justify-center mt-12">
                <div className="flex flex-row justify-between border-b-[1px] border-[#EE5566] border-opacity-50 w-11/12 pb-1">
                    <div className="flex flex-row gap-10 ml-5">
                        <p className="text-[#EE5566] text-opacity-80">#</p>
                        <p className="text-[#EE5566] text-opacity-80">Title</p>
                    </div>
                    <div className="mr-10">
                        <AiOutlineClockCircle className="text-[#EE5566] text-opacity-80"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-center">
                <div className="mt-5 flex flex-col justify-center w-11/12">
                {
                    (data.length > 1) ? 
                    data.map((item,index) => (
                        <div className="flex flex-row justify-between mt-2">
                            <div className="flex flex-row gap-10 ml-5">
                                <div className="flex items-center">
                                    <p className="text-white text-opacity-70">{index+1}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className="text-white text-opacity-80 text-lg font-semibold">{item.name}</p>
                                    <div className='flex flex-row'>
                                        {item.artists.length > 1 
                                            ? item.artists.map((artist,index) => (
                                                <NavLink to={`/artist/${artist.id}`} className="text-white text-opacity-60 text-sm font-normal hover:underline">
                                                    {artist.name}{index !== item.artists.length - 1 ? `, ` : ''}      
                                                </NavLink>
                                            ))
                                            : <NavLink to={`/artist/${item.artists[0].id}`} className="text-white text-opacity-60 text-sm font-normal hover:underline">{item.artists[0].name}</NavLink>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='mr-10'>
                                <div className="flex items-center">
                                    <p className="text-white text-opacity-70">{convertMsToMinSec(item.duration_ms)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                    : 
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-10 ml-5">
                            <div className="flex items-center">
                                <p className="text-white text-opacity-70">1</p>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-white text-opacity-80 text-lg font-semibold">{data[0].name}</p>
                                <NavLink to={`/artist/${data[0].artists[0].id}`} className="text-white text-opacity-60 text-sm font-normal hover:underline">{data[0].artists[0].name}</NavLink>
                            </div>
                        </div>
                        <div className='mr-10 flex items-center'>
                            <p className="text-white text-opacity-70">{convertMsToMinSec(data[0].duration_ms)}</p>
                        </div>
                    </div>
                }
                </div>
            </div>
        </div>
    )
}


export default DiscoveryCard