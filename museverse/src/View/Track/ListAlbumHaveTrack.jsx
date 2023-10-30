import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading/Loading';

import { Spotify } from '../../API/Credentials';
import { convertMsToMinSec } from '../Playlist/SplitNumber';

function ListAlbumHaveTrack({ trackID, artistID }) {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState([]);

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
            // Get albums by artistID
            axios(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album,single&market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(albumResponse => {
                const albumItems = albumResponse.data.items;
                const albumPromises = albumItems.map(album => {
                    return axios(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + response.data.access_token
                        }
                    });
                });

                Promise.all(albumPromises)
                    .then(trackResponses => {
                        const filteredAlbums = albumItems.filter((album, index) => {
                            // Check if the album contains the specified trackID
                            return trackResponses[index].data.items.some(track => track.id === trackID);
                        });
                        
                        setAlbums(filteredAlbums);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [artistID, trackID]);

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
            axios(`https://api.spotify.com/v1/albums/${albums[0].id}/tracks?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setTrack(response.data.items);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [albums]);

    if (loading) return <div><Loading /></div>;

    return (
        <div className='mt-10'>
            <div className='flex justify-center'>
                <div className='w-11/12'>
                    <div className='flex flex-row gap-2'>
                        <div>
                            <img src={albums[0].images[0].url} className='w-12 h-12' alt={albums[0].name} />
                        </div>
                        <div>
                            <p className='text-sm font-normal text-[#EE5566] text-opacity-80'>From the single</p>
                            <p className='font-semibold text-white text-opacity-95 text-xl'>{albums[0].name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-5'>
                {
                    track.map((item, index) => (
                        <div className='flex justify-center'>
                            <div className='w-11/12'>
                                <div className='flex flex-row justify-between'>
                                    <div className={`flex flex-row  ${(index >= 9) ? "gap-5" : "gap-6"}`}>
                                        <div className='flex items-center'>
                                            <p className={`text-white text-opacity-75 text-lg font-medium`}>{index+1}</p>
                                        </div>
                                        <div>
                                            <p className='text-white text-lg font-medium text-opacity-90'>{item.name}</p>
                                            <div>
                                                {
                                                    item.artists.map((artist, artistIndex) => (
                                                        <NavLink to={`/artist/${item.id}`} className={`text-sm text-white font-normal hover:underline`} key={index}>
                                                            {artist.name}{artistIndex !== item.artists.length - 1 ? `, ` : ' '} 
                                                        </NavLink>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-white text-opacity-70'>{convertMsToMinSec(item.duration_ms)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ListAlbumHaveTrack;
