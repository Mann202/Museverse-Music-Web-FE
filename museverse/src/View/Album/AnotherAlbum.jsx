import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom'
import React from 'react'
import axios from "axios";

import { Spotify } from "../../API/Credentials";
import ArtistCardAlbum from "../Artists/ArtistCardAlbum";
import Loading from "../Loading/Loading";

function AnotherAlbum({ id, name, dark }) {
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
                axios(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&market=VN&limit=6`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + response.data.access_token
                    }
                })
                    .then(json => {
                        setData(json.data.items); // Lưu dữ liệu từ API vào state
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

    if (loading)
        return <Loading />

    return (
        <div className="mt-10">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-5 ml-5">
                    <NavLink to={`/artist/${id}/all-albums`} className='text-[#EE5566] ml-5 text-xl font-bold hover:underline'>Another album of {name}</NavLink>
                </div>
                <div className="flex flex-row items-end mr-7">
                    <NavLink to={`/artist/${id}/all-albums`} className="text-[#EE5566] text-opacity-80 hover:underline">Show all</NavLink>
                </div>
            </div>
            <div className="mt-5 flex justify-center">
                <div className="flex flex-row content-start gap-5 flex-wrap">
                    {
                        data.map(item => (
                            <ArtistCardAlbum
                                id={item.id}
                                name={item.name}
                                release={item.release_date}
                                image={item.images[0].url}
                                dark={dark}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default AnotherAlbum