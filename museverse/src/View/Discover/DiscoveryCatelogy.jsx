import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Spotify } from '../../API/Credentials';
import Playlist from '../Playlist/Playlist';
import PlaylistCard from '../Playlist/PlaylistCard';
import CatelogyCard from '../Catelogy/CatelogyCard';

function DiscoveryCatelogy() {
    const[vietNam, setVietNam] = useState([])
    const[topList, setTopList] = useState([])
    const[pop, setPop] = useState([])
    const[mood, setMood] = useState([])
    const[hiphop, setHiphop] = useState([])

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
            axios(`https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFLIOWOrpNSUR/playlists`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setVietNam(response.data.playlists.items)
            })

            axios(`https://api.spotify.com/v1/browse/categories/toplists/playlists`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setTopList(response.data.playlists.items)
            })

            axios(`https://api.spotify.com/v1/browse/categories/pop/playlists`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setPop(response.data.playlists.items)
            })

            axios(`https://api.spotify.com/v1/browse/categories/mood/playlists`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setMood(response.data.playlists.items)
            })

            axios(`https://api.spotify.com/v1/browse/categories/hiphop/playlists`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setHiphop(response.data.playlists.items)
            })
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    console.log(vietNam)

    return (
        <div>
            <div className='pt-8'>
            <div>
                <h1 className='text-white text-xl font-semibold'>Discover the Rich Melodies of Vietnamese Music</h1>
            </div>
            <div className='flex justify-center items-center pt-5'>
                <div className="flex flex-row gap-9 w-11/12">
                    {
                        vietNam.slice(0,5).map(item => {
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

        <div className='pt-8'>
            <div>
                <h1 className='text-white text-xl font-semibold'>Top list of all time</h1>
            </div>
            <div className='flex justify-center items-center pt-5'>
                <div className="flex flex-row gap-9 w-11/12">
                    {
                        topList.slice(0,5).map(item => {
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


        <div className='pt-8'>
            <div>
                <h1 className='text-white text-xl font-semibold'>Exploring the World of Pop Music</h1>
            </div>
            <div className='flex justify-center items-center pt-5'>
                <div className="flex flex-row gap-9 w-11/12">
                    {
                        pop.slice(0,5).map(item => {
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

        <div className='pt-8'>
            <div>
                <h1 className='text-white text-xl font-semibold'>Emotional Soundscapes: Delving into Mood-Enhancing Music</h1>
            </div>
            <div className='flex justify-center items-center pt-5'>
                <div className="flex flex-row gap-9 w-11/12">
                    {
                        mood.slice(0,5).map(item => {
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

        <div className='pt-8'>
            <div>
                <h1 className='text-white text-xl font-semibold'>Celebrating the World of Hip-Hop Music</h1>
            </div>
            <div className='flex justify-center items-center pt-5'>
                <div className="flex flex-row gap-9 w-11/12">
                    {
                        hiphop.slice(0,5).map(item => {
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
        </div>
    )
}

export default DiscoveryCatelogy