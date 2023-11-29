import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom'
import React from 'react'
import axios from "axios";

import { Spotify } from "../../API/Credentials";
import NewReleasesCard from "./NewReleasesCard";
import Loading from "../Loading/Loading";
import Headers from "../Header/Header";

const AllNewReleases = () => {
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
                axios(`https://api.spotify.com/v1/browse/new-releases?country=VN`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + response.data.access_token
                    }
                })
                    .then(json => {
                        setData(json.data.albums.items); // Lưu dữ liệu từ API vào state
                        console.log(json.data.albums.items);
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

    if(loading)
        return <Loading/>

    return (
        <div className="h-screen overflow-y-scroll flex flex-col w-full bg-[#171719] ">
            <Headers bgColor={'#171719'}/>            
            <div className="flex flex-row gap-5 ml-5 mt-5">
                <p className='text-[#EE5566] font-bold text-xl'>Hand-picked new releases</p>
            </div>
            <div className="m-5 flex justify-center">
                <div className="flex content-start gap-5 flex-wrap">
                    {
                        data.map(item => (
                            <NewReleasesCard
                                id={item.id}
                                name={item.name}
                                artists={item.artists}
                                image={item.images[0].url}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default AllNewReleases