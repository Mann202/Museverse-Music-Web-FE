import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

import { Spotify } from '../../API/Credentials'
import CatelogyListCard from './CatelogyListCard'
import Loading from '../Loading/Loading'
import Headers from '../Header/Header'
import { useParams } from 'react-router'
import Searching from './Searching'

const Search = () => {
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const ClientID = Spotify.ClientID;
    const ClientSecret = Spotify.ClientSecret;

    const {searching} = useParams() 
    const {catelogyID} = useParams()

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
            axios('https://api.spotify.com/v1/browse/categories?country=VN&offset=0&limit=50', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.categories.items); 
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

    if(loading) {
        return <div><Loading /></div>
    } 

    if(searching != undefined) return (
        <div>
            <Headers />
            <div>
                <Searching searching={searching}/>
            </div>
        </div>
    )

    return (
    <div>
        <Headers />
        <div className="w-full h-screen overflow-y-scroll mt-5">
            <div className="lg:ml-6">
                <h2 className="font-bold text-2xl text-white">Recent searches</h2>
            </div>
            <div>
                <h2 className='font-bold text-2xl text-white lg:ml-6'>Browse all</h2>
                <div className="flex flex-row gap-x-12 gap-y-8 w-full flex-wrap pb-40 pt-5 justify-center">
                    {data.map(item => (
                        <CatelogyListCard
                            key={item.id}
                            image={item.icons[0].url}  
                            name={item.name}
                            id={item.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>

    );
};

export default Search;
