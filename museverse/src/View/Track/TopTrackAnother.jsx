import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';

import { Spotify } from '../../API/Credentials';
import ArtistAlbum from '../Artists/ArtistAlbum';

import { chuyenNgay } from '../Playlist/SplitNumber';
import { NavLink } from 'react-router-dom';
import { LoggedContext } from "../Login-SignUp/LoggedContext";

function TopTrackAnother({id, dark}) {
    const { logged, setLogged } = useContext(LoggedContext);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [artist, setArtistData] = useState([])
    const [dataSlice, setDataSlice] = useState(0)

    useEffect(() => {
        if(logged) {
            setDataSlice(6)
        } else {
            setDataSlice(7)
        }
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
            axios(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data.tracks)
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
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
            axios(`https://api.spotify.com/v1/artists/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setArtistData(response.data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [id]);
    
    if(loading) return <div>Loading..</div>
    return (
        <div className='mt-10'>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row gap-2 ml-8'>
                    <div className='flex items-center'>
                        <img src={artist.images[0].url} className='w-10 h-10 rounded-full'></img>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-[#EE5566] text-opacity-80'>Top track by</p>
                        <NavLink to={`/artist/${artist.id}`} className="hover:underline text-white font-bold text-lg">{artist.name}</NavLink>
                    </div>
                </div>
                <div className='mr-7 flex flex-row items-end'>
                    <NavLink to={`/artist/${id}/discovery-all`} className={`hover:underline text-[#EE5566] ${(data.length < 6) ? "hidden" : ""}`}>Show all</NavLink>
                </div>
            </div>
            <div className={`flex mt-5 ${(dataSlice <= 7) ? (data.length < 7) ? (logged) ? "justify-start ml-5" : "justify-start ml-8" : "justify-center" : ""}`}>
                <div>
                    <div className='flex flex-row flex-wrap gap-5'>
                    {data.slice(0,dataSlice).map(item => (
                        <div
                        className={`${dark ? "bg-white bg-opacity-10 hover:bg-opacity-20" : "bg-black bg-opacity-30 hover:bg-opacity-60"} h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 cursor-pointer`}
                        //onMouseEnter={() => setIsHovered(true)}
                        //onMouseLeave={() => setIsHovered(false)}
                        //onClick={changeRoute}
                        >
                            <div className="relative overflow-hidden">
                                <img src={item.album.images[0].url} className="rounded-xl w-40 h-40 mt-3" />
                                
                            </div>
                            <div className="w-40 pb-4">
                                <div>
                                <h3 className="font-semibold text-base text-white">
                                    {item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name}
                                </h3>
                                <p className="font-normal text-sm text-[#9898A6]">
                                    {chuyenNgay(item.album.release_date)}
                                </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopTrackAnother