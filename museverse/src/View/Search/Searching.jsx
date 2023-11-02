import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { Spotify } from '../../API/Credentials'
import Loading from '../Loading/Loading';
import SearchingTrackCard from './SearchingTrackCard';
import { BsPlayFill } from 'react-icons/bs';
import SearchingAlbumCard from './SearchingAlbumCard';
import SearchingPlaylistCard from './SearchingPlaylistCard';
import SearchingArtistsCard from './SearchingArtistsCard';

function Searching({searching}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchData, setSearchData] = useState([])
    const [searchAlbumData, setSeachAlbumData] = useState([])
    const [searchPlaylistData, setSearchPlaylistData] = useState([])
    const [searchArtistsData, setSearchArtistsData] = useState([])

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
            axios(`https://api.spotify.com/v1/search?q=${searching}&type=track&market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.tracks.items); 
            })

            axios(`https://api.spotify.com/v1/search?q=${searching}&type=track&market=VN&limit=1`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setSearchData(json.data.tracks.items); 
            })

            axios(`https://api.spotify.com/v1/search?q=${searching}&type=album&market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setSeachAlbumData(json.data.albums.items); 
            })

            axios(`https://api.spotify.com/v1/search?q=${searching}&type=playlist&market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setSearchPlaylistData(json.data.playlists.items); 
            })

            axios(`https://api.spotify.com/v1/search?q=${searching}&type=artist&market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setSearchArtistsData(json.data.artists.items); 
                setLoading(false)
            })
        })
    }, [searching]);

    const sortedData = data.sort((a, b) => b.popularity - a.popularity);

    if (loading) return <Loading />;

    return (
        <div className='h-screen pb-40 overflow-y-scroll'>
            <div className='flex flex-row gap-12 mt-5 ml-5'>
                <div className='w-4/12'>
                    <div>
                        <h1 className='text-white font-bold text-2xl'>Top result</h1>
                    </div>
                    <div className='bg-white bg-opacity-10 rounded-md'>
                    {searchData.map(item => (
                        <div className='flex flex-col gap-6 ml-2 pb-2 pt-2 mt-2'>
                            <img src={item.album.images[0].url} alt="" className='w-32 h-32 rounded-lg mt-1'></img>
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-col'>
                                    <p className='text-white font-bold text-2xl' key={item.id}>{item.name}</p>
                                    <div className='flex flex-row'>
                                        {
                                            item.artists.map((artist,index) => (
                                                <p className='text-white'>{artist.name}{index !== item.artists.length - 1 ? ", " : " "}</p>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className='mt-2 mr-2'>
                                    <button className='w-12 h-12 rounded-full bg-[#EE5566] flex justify-center items-center'>
                                        <BsPlayFill className='text-white text-3xl'/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className='w-7/12'>
                    <div>
                        <h1 className='text-white font-bold text-2xl'>Tracks</h1>
                    </div>
                    <div className='flex flex-col gap-3 mt-2'>
                        {
                            data.slice(0,4).map(item => (
                                <SearchingTrackCard 
                                    name={item.name}
                                    duration={item.duration_ms}
                                    artists={item.artists}
                                    img={item.album.images[0].url} 
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
                        
            <div className='mt-12 ml-5'>
                <div className='flex flex-col gap-5'>
                    <div>
                        <h1 className='text-white font-bold text-2xl'>Album</h1>
                    </div>
                    <div className='flex flex-row gap-4 w-full'>
                        {
                            searchAlbumData.slice(0,6).map((item) => (
                                <SearchingAlbumCard 
                                id={item.id}
                                name={item.name}
                                release={item.release_date}
                                img={item.images[0].url}
                                artists={item.artists}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className='mt-12 ml-5'>
                <div className='flex flex-col gap-5'>
                    <div>
                        <h1 className='text-white font-bold text-2xl'>Playlist</h1>
                    </div>
                    <div className='flex flex-row gap-4 w-full'>
                        {
                            searchPlaylistData.slice(0,6).map((item) => (
                                <SearchingPlaylistCard
                                id={item.id} 
                                name={item.name}
                                type={item.type}
                                img={item.images[0].url}
                                artists={item.artists}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>

            {
                (searchArtistsData.length > 0) 
                    ?
                        <div className='mt-12 ml-5'>
                            <div className='flex flex-col gap-5'>
                                <div>
                                    <h1 className='text-white font-bold text-2xl'>Artists</h1>
                                </div>
                                <div className='flex flex-row gap-4 w-full'>
                                    {
                                        searchArtistsData.slice(0,6).map((item) => (
                                            <SearchingArtistsCard 
                                            id={item.id}
                                            name={item.name}
                                            type={item.type}
                                            image={item.images}
                                            artists={item.artists}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    : ""
            }
        </div>
    );
}

export default Searching