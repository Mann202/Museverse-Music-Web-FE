import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';

function DiscoveryRecommendBaseArtist() {
    const [followArtistResults, setFollowArtistResults] = useState([]);
    const [artistInfor, setArtistInfor] = useState([]);
    const [loading, setLoading] = useState(true)
    const [hide, setHide] = useState(false)

    const id = 1;
    const followArtist = [];

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
            const accessToken = response.data.access_token;
            
            
            axios.get(`http://127.0.0.1:8000/api/followArtist?id=${id}`)
                .then(response => {
                    followArtist.splice(0);
                    response.data.forEach(item => {
                        followArtist.push(item.artist_id);
                    });
                    
                    if(response.data.length < 3) {
                        setHide(true)
                    }
                    const artistPromises = followArtist.map(artistId => {
                        return axios(`https://api.spotify.com/v1/artists/${artistId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                    });

                    Promise.all(artistPromises)
                        .then(results => {
                            setArtistInfor(results.map(json => json.data));

                            const getRecommendationsPromises = followArtist.map(artistId => {
                                return axios(`https://api.spotify.com/v1/recommendations?limit=5&market=VN&seed_artists=${artistId}`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': 'Bearer ' + accessToken
                                    }
                                });
                            });

                            Promise.all(getRecommendationsPromises)
                                .then(results => {
                                    const allTracks = results.flatMap(response => response.data.tracks);
                                    setFollowArtistResults(allTracks);
                                    setLoading(false);
                                })
                        })
                });
        })
    }, []);


    if(loading) return <Loading />
    if(hide) return null;
    return (
        <div>
            <div>
                <div className='pt-5' key={artistInfor[0].id}>
                    <div className='flex flex-row gap-2'>
                        <p className='text-white text-xl font-semibold'>Discover Music Like</p>
                        <img src={artistInfor[0].images[0].url}  className='rounded-full w-8 h-8'/>
                        <p className='text-white text-xl font-semibold'>{artistInfor[0].name}</p>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <div className='w-11/12 flex flex-row gap-9 pt-8'>
                        {
                            followArtistResults.slice(0,5).map(item => {
                                return (
                                    <div className='h-76 w-48 bg-[#181818] hover:bg-[#282828] cursor-pointer pt-3 rounded-lg' >
                                        <div className='flex items-center justify-center'>
                                            <img src={item.album.images[0].url} className=' rounded-xl w-40 h-40'></img>
                                        </div>
                                        <div className='pt-3'>
                                            <div className="flex items-center justify-center flex-col pb-3">
                                                <p className='text-white'>{item.name.length < 23 ? item.name : item.name.slice(0,22)+"..."}</p>
                                                <p className='text-white text-opacity-40'>{item.artists[0].name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            <div>
                <div className='pt-5' key={artistInfor[1].id}>
                    <div className='flex flex-row gap-2'>
                        <p className='text-white text-xl font-semibold'>Explore Tunes in the Style of</p>
                        <img src={artistInfor[1].images[0].url}  className='rounded-full w-8 h-8'/>
                        <p className='text-white text-xl font-semibold'>{artistInfor[1].name}</p>
                    </div>
                </div>
                    
                <div className='flex justify-center'>
                    <div className='w-11/12 flex flex-row gap-9 pt-8'>
                        {
                            followArtistResults.slice(5,10).map(item => {
                                return (
                                    <div className='h-76 w-48 bg-[#181818] hover:bg-[#282828] cursor-pointer pt-3 rounded-lg' >
                                        <div className='flex items-center justify-center'>
                                            <img src={item.album.images[0].url} className=' rounded-xl w-40 h-40'></img>
                                        </div>
                                        <div className='pt-3'>
                                            <div className="flex items-center justify-center flex-col pb-3">
                                                <p className='text-white'>{item.name.length < 23 ? item.name : item.name.slice(0,22)+"..."}</p>
                                                <p className='text-white text-opacity-40'>{item.artists[0].name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            <div>
                <div className='pt-5' key={artistInfor[2].id}>
                    <div className='flex flex-row gap-2'>
                        <p className='text-white text-xl font-semibold'>Musical Journey with</p>
                        <img src={artistInfor[2].images[0].url}  className='rounded-full w-8 h-8'/>
                        <p className='text-white text-xl font-semibold'>{artistInfor[2].name}'s Vibe</p>
                    </div>
                </div>

                <div className='flex justify-center'>
                <div className='w-11/12 flex flex-row gap-9 pt-8'>
                        {
                            followArtistResults.slice(10,15).map(item => {
                                return (
                                    <div className='h-76 w-48 bg-[#181818] hover:bg-[#282828] cursor-pointer pt-3 rounded-lg' >
                                        <div className='flex items-center justify-center'>
                                            <img src={item.album.images[0].url} className=' rounded-xl w-40 h-40'></img>
                                        </div>
                                        <div className='pt-3'>
                                            <div className="flex items-center justify-center flex-col pb-3">
                                                <p className='text-white'>{item.name.length < 23 ? item.name : item.name.slice(0,22)+"..."}</p>
                                                <p className='text-white text-opacity-40'>{item.artists[0].name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default DiscoveryRecommendBaseArtist;
