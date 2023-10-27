import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import {AiOutlineUnorderedList, AiOutlineHeart} from 'react-icons/ai'
import {HiRectangleGroup} from 'react-icons/hi2'
import {BsPlayFill, BsThreeDots} from 'react-icons/bs'
import { Spotify } from '../../../API/Credentials'

import ArtistCardAlbum from '../ArtistCardAlbum'
import { chuyenNgay } from '../../Playlist/SplitNumber'
import DiscoveryCard from './DiscoveryCard'
import Loading from '../../Loading/Loading'

function Discovery() {
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [type, setType] = useState('single')
    const [display, setDisplay] = useState(false)
    const [preData, setPreData] = useState([])

    const {artistID} = useParams()

    const listAlbum = []

    function handleChange(event) {
        setType(event.target.value)
    }

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
            setToken(response.data.access_token);
            
            // Gọi API Spotify ngay sau khi nhận được token
            axios(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=${type}&market=VN&`, {
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
    }, [setToken, setData, type]);

    useEffect(() => {
        data.map(item => {
            listAlbum.push(item.id)
        })
    },[data])

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
            axios(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=VN&limit=6`, {
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

    if(loading) return <div><Loading /></div>

    return (
        <div className='h-screen overflow-y-scroll w-full pb-32'>
            <div className='flex flex-row justify-between'>
                <div className='flex items-end ml-8'>
                    <select value={type} onChange={handleChange} className="bg-transparent text-[#EE5566] text-opacity-80 w-32">
                        <option value="single" className="bg-[#EE5566] text-white">Single</option>
                        {(preData.length == 0) ? "" : <option className="bg-[#EE5566] text-white" value="album">Album</option>}
                    </select>
                </div>
                <div className='flex flex-row justify-end mr-8 gap-3 mt-5'>
                    <button className={`rounded-full w-8 h-8 flex justify-center items-center ${display ? "" : "bg-[#EE5566] bg-opacity-10"}`} onClick={() => {setDisplay(false)}}>
                        <AiOutlineUnorderedList className="text-white text-opacity-80 text-xl"/>
                    </button>
                    <button className={`rounded-full w-8 h-8 flex justify-center items-center ${display ? "bg-[#EE5566] bg-opacity-10" : ""}`} onClick={() => {setDisplay(true)}}>
                        <HiRectangleGroup className="text-white text-opacity-80 text-xl"/>
                    </button>
                </div>
            </div>
            {display ? <GroupAlbum data={data}/> : <ListAlbum data={data} listAlbum={listAlbum}/>}
        </div>
    )
}

export function GroupAlbum({data}) {
    return(
        <div className="flex justify-center">
            <div className="flex flex-row content-start gap-5 flex-wrap mt-12 w-10/12">
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
    )
}

export function ListAlbum({data, listAlbum}) {
    const [trackAlbum, setTrackAlbum] = useState([]);

    return(
        <div className='flex flex-col gap-10 justify-center'>
            {data.map((item, index) => (
                <div className="mt-16">
                    <div className="flex flex-row ml-16 gap-5 w-8/12" key={index}>
                        <img src={item.images[0].url} alt={item.name} className='w-36 h-36'></img>
                        <div className="flex flex-col gap-5 gap-y-10">
                            <div>
                                <h1 className="text-white text-3xl font-bold">{item.name}</h1>
                                <p className="text-white text-opacity-80 text-base font-normal">
                                    {item.album_type === 'single' ? 'Single' : 'Album'}
                                    {item.release_date && ` . ${chuyenNgay(item.release_date)}`}
                                </p>
                            </div>
                            <div>
                                <PlayButton />
                            </div>
                        </div> 
                    </div>
                    <div className="mt-5">
                        <DiscoveryCard id={item.id}/>
                    </div>
                </div>
                
            ))}
        </div>
    )
}

function PlayButton() {
    return (
        <div className="flex flex-row justify-start gap-5 -mt-5">
            <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                <BsPlayFill className="text-black text-3xl" />
            </button>
            <div className="flex justify-center items-center">
                <button>
                    <AiOutlineHeart className="text-[#EE5566] text-opacity-80 text-xl"/>
                </button>
            </div>
            <div className="flex justify-center items-center">
                <button>
                    <BsThreeDots className="text-[#EE5566] text-opacity-80 text-xl"/>
                </button>
            </div>
        </div>
      );
}

export default Discovery