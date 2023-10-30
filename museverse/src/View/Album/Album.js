import React, { useState, useEffect, useRef } from 'react';
import { BsPlayFill, BsThreeDots, BsDot, BsHeart } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ColorThief from 'colorthief'

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import { formatNumber, chuyenNgay } from '../Playlist/SplitNumber';
import AlbumTrack from './AlbumTrack';
import ArtistAlbum from '../Artists/ArtistAlbum';
import AnotherAlbum from './AnotherAlbum';

const Album = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState('')
    const [image, setImage] = useState('')

    const { albumID } = useParams();


    const imageRef = useRef(null);

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
                const token = response.data.access_token;
                // Gọi Spotify Web API để lấy thông tin về album
                axios(`https://api.spotify.com/v1/albums/${albumID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(response => {
                        setData(response.data)
                        console.log(data);
                        setImage(response.data.images[0].url)
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    }, [albumID]);

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

    if (loading) {
        return <div><Loading /></div>
    }

    return (
        <div className="h-screen overflow-y-scroll flex flex-col gap-y-10 pb-20 w-full">
            <div style={{ background: `${backgroundColor}` }} className="flex flex-row gap-10">
                <div className="h-[22rem] flex items-center flex-row ml-7">
                    <img src={data.images[0].url} className="rounded-full w-60 h-64"></img>
                </div>
                <div className='flex gap-6 items-center flex-col justify-center'>
                    <div>
                        <p className="font-medeium text-lg text-white capitalize">{data.album_type}</p>
                        <h1 className="text-8xl text-white font-bold">{data.name}</h1>
                        <h3 className="text-base text-white text-opacity-80 font-base flex items-center">
                            {data.artists[0].name}
                            <BsDot />
                            {new Date(data.release_date).getFullYear()}
                            <BsDot />
                            {formatNumber(data.total_tracks)} bài hát
                        </h3>
                    </div>
                </div>
            </div>
            <div style={{ background: `linear-gradient(${backgroundColor}, black)` }} className="w-full pt-8 pb-32">
                <PlayButton />
                <AlbumTrack id={albumID} />
                <div className='text-[#AFAFAF] text-xs flex flex-col ml-10'>
                    <div className='text-base'>{chuyenNgay(data.release_date)}</div>
                    <div>
                        {data.copyrights.map((item, index) => (
                            <div key={index}>{item.text}</div>
                        ))}
                    </div>
                </div>
                {/* <ArtistAlbum
                    id={data.artists[0].id}
                /> */}
                <AnotherAlbum
                    id={data.artists[0].id}
                />
            </div>
        </div>
    );
}

function PlayButton() {
    return (
        <div className="flex flex-row ml-10 gap-5 -mt-5">
            <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                <BsPlayFill className="text-black text-3xl" />
            </button>
            <div className='flex items-center'>
                <BsHeart className="text-[#AFAFAF] text-3xl" />
            </div>
            <div className="flex justify-center items-center">
                <button>
                    <BsThreeDots className="text-[#AFAFAF] text-xl" />
                </button>
            </div>
        </div>
    );
}

export default Album