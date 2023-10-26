import { useState, useEffect} from "react";
import {NavLink} from 'react-router-dom'
import React from 'react'
import axios from "axios";

import { Spotify } from "../API/Credentials";
import ArtistCardAlbum from "./ArtistCardAlbum";
import RelatedArtist from "./RelatedArtist";

function ArtistAlbum({id}) {
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(6)
    const [type, setType] = useState("single")
    const [disable, setDisable] = useState(false)

    function handleChangeType1() {
        setType('single')
    }
    function handleChangeType2() {
        setType('album')
    }

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
            axios(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=${type}&market=VN&limit=${limit}`, {
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
    }, [setToken, setData, type, limit]);

  return (
    <div className="mt-10">
        <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-5 ml-5">
                <button onClick={handleChangeType1} className="w-20 h-7 rounded-full border-[1px] bg-transparent border-black border-opacity-60 text-white text-opacity-50">Single</button>
                <button onClick={handleChangeType2} className="w-20 h-7 rounded-full border-[1px] bg-transparent border-black border-opacity-60 text-white text-opacity-50">Album</button>
            </div>
            <div className="flex flex-row items-end mr-7">
                <NavLink className="text-white text-opacity-80">Show all</NavLink>
            </div>
        </div>
        <div className="ml-5 mt-5">
        <div className="flex flex-row content-start gap-5 flex-wrap">
        {
            data.map(item => (
                <ArtistCardAlbum 
                id={item.id}
                name={item.name}
                release={item.release_date}
                image={item.images[0].url}
                />
            ))
        }
        </div>
        </div>
    </div>
  )
}

export default ArtistAlbum