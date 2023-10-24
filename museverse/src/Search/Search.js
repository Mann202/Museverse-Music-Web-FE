import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

import { Spotify } from '../API/Credentials'
import CatelogyCard from './CatelogyCard'

const CategoryFetcher = ({ setToken, setData }) => {
    const ClientID = Spotify.ClientID;
    const ClientSecret = Spotify.ClientSecret;

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
            axios('https://api.spotify.com/v1/browse/categories?country=VN&offset=0&limit=50', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.categories.items); // Lưu dữ liệu từ API vào state
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [setToken, setData]);

    return null;
};

const Search = () => {
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);

    return (
        <div className="w-full h-screen overflow-y-scroll">
            <div>
                <h2 className="font-bold text-2xl text-white">Recent searches</h2>
            </div>
            <div>
                <h2 className='font-bold text-2xl text-white'>Browse all</h2>
                <div className="flex flex-row gap-x-12 gap-y-8 w-full flex-wrap pb-40 mt-8 ml-8">
                    <CategoryFetcher setToken={setToken} setData={setData} />
                    {data.map(item => (
                        <CatelogyCard
                            key={item.id}
                            image={item.icons[0].url}  
                            name={item.name}
                            id={item.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
