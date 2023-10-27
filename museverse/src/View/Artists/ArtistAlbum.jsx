import { useState, useEffect} from "react";
import {NavLink} from 'react-router-dom'
import React from 'react'
import axios from "axios";

import { Spotify } from "../../API/Credentials";
import ArtistCardAlbum from "./ArtistCardAlbum";
import RelatedArtist from "./RelatedArtist";

function ArtistAlbum({id, dark}) {
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [preData, setPreData] = useState([])
    const [limit, setLimit] = useState(6)
    const [type, setType] = useState("single")
    const [choose, setChoose] = useState(true)

    function handleChangeType1() {
        setType('single')
        setChoose(true)
    }
    function handleChangeType2() {
        setType('album')
        setChoose(false)
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
            axios(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album&market=VN&limit=6`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setPreData(json.data.items); // Lưu dữ liệu từ API vào state
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

    

  return (
    <div className="mt-10">
        <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-5 ml-5">
                <button onClick={handleChangeType1} className={`w-20 h-7 rounded-full border-[1px] border-[#EE5566] border-opacity-60 text-[#EE5566] ${choose ? "bg-[#EE5566] text-white text-opacity-100" : ""}`}>Single</button>
                <button onClick={handleChangeType2} className={`w-20 h-7 rounded-full border-[1px] border-[#EE5566] border-opacity-60 text-[#EE5566] ${(preData.length == 0) ? "hidden" : ""} ${choose ? "" : "bg-[#EE5566] text-white text-opacity-100"}`}>Album</button>
            </div>
            <div className="flex flex-row items-end mr-7">
                <NavLink to={`/artist/${id}/discovery-all`} className="text-[#EE5566] text-opacity-80 hover:underline">Show all</NavLink>
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

export default ArtistAlbum