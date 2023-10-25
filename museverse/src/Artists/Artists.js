import React, { useState, useEffect, useRef } from 'react';
import { BsPlayFill, BsThreeDots } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ColorThief from 'colorthief'

import { Spotify } from '../API/Credentials';
import Loading from '../Loading/Loading';
import ArtistTrack from './ArtistTrack';
import ArtistAlbum from './ArtistAlbum';
import RelatedArtist from './RelatedArtist';

function Artist() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState('')
    const [image, setImage] = useState('')

    const { artistID } = useParams();
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
            // Gọi Spotify Web API để lấy thông tin về nghệ sĩ
            axios(`https://api.spotify.com/v1/artists/${artistID}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data)
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
    }, [artistID]);
  
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
    return (
        <div className="h-screen overflow-y-scroll flex flex-col gap-y-10 pb-32">
            <div style={{background: `${backgroundColor}`}} className="flex flex-row gap-7">
                <div>
                    <img src={data.images[0].url} className="rounded-full w-60 h-64"></img>
                </div>
                <div className='flex flex-row gap-5'>
                    <div>
                        <p className="text-base text-white font-base">Artist</p>
                        <h1 className="text-4xl text-white font-bold">{data.name}</h1>
                        <h3 className="text-base text-white font-base">{data.followers.total} người theo dõi</h3>
                    </div>
                    <div>
                    {
                        data.genres.map(item => (
                            <p className="text-base text-white font-base">{item}</p>
                        ))
                    }
                    </div>
                </div>
            </div>
            <div style={{background: `linear-gradient(${backgroundColor}, black)`}}>
                <PlayButton />
                <ArtistTrack id={artistID} />
                <ArtistAlbum id={artistID} />
                <RelatedArtist id={artistID} />
            </div>
        </div>
    );
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

export default Artist;
