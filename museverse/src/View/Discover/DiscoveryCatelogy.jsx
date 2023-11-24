import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Spotify } from '../../API/Credentials';
import Playlist from '../Playlist/Playlist';
import PlaylistCard from '../Playlist/PlaylistCard';
import CatelogyCard from '../Catelogy/CatelogyCard';
import { categoriesWithTitles } from './List';

function DiscoveryCatelogy() {
    const[catelogy, setCatelogy] = useState([])

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
            const selectedCategories = getRandomElements(categoriesWithTitles, 5);
            
            const requests = selectedCategories.map(item => {
                return axios(`https://api.spotify.com/v1/browse/categories/${item.id}/playlists?limit=5`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => {
                    return {
                        title: item.title,
                        data: response.data.playlists.items
                    };
                });
            });
    
            Promise.all(requests)
                .then(responses => {
                    setCatelogy(responses);
                });
        });
    }, []);

    console.log(catelogy)

    return (
        <div>
            {
                catelogy.map(item => {
                    return(
                        <div className='pt-8'>
                            <div>
                                <h1 className='text-white text-xl font-semibold'>{item.title}</h1>
                            </div>
                            <div className='flex justify-center items-center pt-5'>
                                <div className="flex flex-row gap-9 w-11/12">
                                {
                                    item.data.map(item => {
                                        return(
                                            <CatelogyCard 
                                            id={item.id}
                                            name={item.name}
                                            description={item.description}
                                            image={item.images[0].url}
                                            />
                                        )
                                        })
                                }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function getRandomElements(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, num); 
}

export default DiscoveryCatelogy