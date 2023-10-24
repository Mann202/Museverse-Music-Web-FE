import React, {useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import ColorThief from 'colorthief';

import { BsPlayFill, BsThreeDots } from 'react-icons/bs';

import { Spotify } from '../API/Credentials';
import Loading from '../Loading/Loading';
import {formatNumber} from '../Playlist/SplitNumber'
import PlaylistCard from './PlaylistCard';
import {chuyenDoiThoiGian} from './SplitNumber'

function Playlist() {
    const [loading, setLoading] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState('');
    const [token, setToken] = useState('');
    const [image, setImage] = useState('')
    const [data, setData] = useState([]);
    const [followers, setFollower] = useState('')
    const [name, setName] = useState('')
    const [description,setDescription] = useState('')
    const [totalTrack, setTotalTrack] = useState('')
    let time = 0;

    const imageRef = useRef(null);
    const {playlistID} = useParams();

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
            axios(`https://api.spotify.com/v1/playlists/${playlistID}?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.tracks.items) // Lưu dữ liệu từ API vào state
                setLoading(false)
                setName(json.data.name)
                setDescription(json.data.description)
                setImage(json.data.images[0].url)
                setTotalTrack(json.data.tracks.total)
                const totalFollower = json.data.followers.total
                const format = formatNumber(totalFollower)
                setFollower(format)
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [setToken, setData]);

    useEffect(() => {
        const colorThief = new ColorThief();
        const imageElement = imageRef.current;
    
        const loadImage = async () => {
          try {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = image;
            img.onload = () => {
              const color = colorThief.getColor(img);
              const hexColor = `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`;
              setBackgroundColor(hexColor);
            };
          } catch (error) {
            console.error('Lỗi tải hình ảnh:', error);
          }
        };
    
        loadImage();
      }, [image]);

    if(loading) {
        return <div><Loading /></div>
    }

    data.forEach((item) => {
        time += item.track.duration_ms
    }) 

    const timeinString = chuyenDoiThoiGian(time)
    console.log(timeinString)


    return (
        <div style={{background: `linear-gradient(${backgroundColor}, black)`}} className="h-screen bg-gradient-to-b from-white to-black overflow-y-scroll flex flex-col gap-y-10">
            <div className="flex flex-row items-center gap-5">
                <img src={image} alt="Category Icon" className="rounded-lg ml-8 mt-8 w-56 h-56"></img>
                <div>
                    <p className="font-normal text-base text-white">Playlist</p>
                    <h1 className="text-7xl font-bold text-white">{name}</h1>
                    <br></br>
                    <p className="font-normal text-sm text-white">{description}</p>
                    <p className="font-medium text-sm text-white text-opacity-60 mt-2">{followers} người thích . {totalTrack} bài hát, khoảng {timeinString}</p>
                </div>
            </div>
            <PlayButton />
            <div className="w-full flex flex-row flex-wrap gap-y-2 justify-center items-start pb-36 bg-opacity-30 bg-black pt-12">
                <HeaderPlaylist />

                {data.map((item, index) => (

                    <PlaylistCard 
                    id={index}
                    name={item.track.name}
                    album={item.track.album.name}
                    date={item.added_at}
                    duration={item.track.duration_ms}
                    image={item.track.album.images[0].url}
                    artist={item.track.artists[0].name}
                    />
                ))}
            </div>
        </div>
    )
}

function PlayButton() {
    return (
        <div className="flex flex-row ml-10 gap-5 -mt-5">
            <button className="bg-[#1ED760] rounded-full w-12 h-12 flex justify-center items-center">
                <BsPlayFill className="text-black text-3xl" />
            </button>
            <div className="flex justify-center items-center">
                <button>
                    <BsThreeDots className="text-[#AFAFAF] text-xl"/>
                </button>
            </div>
        </div>
      );
}

function HeaderPlaylist() {
    return(
        <>
            <div className="flex w-full gap-7">
                <div className="flex felx-row w-full pb-5 pl-3 gap-7">
                    <div className="flex flex-row gap-8 w-5/12">
                        <div className="flex flex-col justify-center">
                            <p className="text-[#B4B4B4] font-medium text-sm w-5">#</p>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-[#B4B4B4] font-medium text-sm">Title</p>
                        </div>
                    </div>
                    <div className="flex flex-row w-7/12 gap-36">
                        <div className="flex flex-col justify-center w-40">
                            <p className="text-[#B1B1B1] font-medium text-sm">Album</p>
                        </div>
                        <div className="flex flex-col justify-center w-52">
                            <p className="text-[#B1B1B1] font-medium text-sm">Added</p>
                        </div>
                        <div className="flex flex-col justify-center w-16">
                            <p className="text-[#B1B1B1] font-medium text-sm">Duration</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Playlist