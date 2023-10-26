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
import ArtistAppear from './ArtistAppear';
import { formatNumber } from '../Playlist/SplitNumber';

function Artist() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState('')
    const [image, setImage] = useState('')
    const [darkerBackgroundColor, setDarkerBackgroundColor] = useState('')

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

    console.log(data)
  
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
                
                const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
                console.log(brightness)
                
                if (brightness > 160) {
                  const darkenedColor = [
                    Math.max(0, color[0] - 100), 
                    Math.max(0, color[1] - 100), 
                    Math.max(0, color[2] - 100), 
                  ];
                  const hexColor = `#${darkenedColor[0].toString(16).padStart(2, '0')}${darkenedColor[1].toString(16).padStart(2, '0')}${darkenedColor[2].toString(16).padStart(2, '0')}`;
                  setBackgroundColor(hexColor);
                } else {
                  
                  const darkenedColor = [
                    Math.max(0, color[0] - 15), 
                    Math.max(0, color[1] - 15), 
                    Math.max(0, color[2] - 15), 
                  ];
                  const hexColor = `#${darkenedColor[0].toString(16).padStart(2, '0')}${darkenedColor[1].toString(16).padStart(2, '0')}${darkenedColor[2].toString(16).padStart(2, '0')}`;
                  setBackgroundColor(hexColor);
                }
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
        <div className="h-screen overflow-y-scroll flex flex-col gap-y-6 pb-20 w-full">
            <div style={{background: `${backgroundColor}`}} className="flex flex-row gap-10">
                <div className="flex items-center flex-row ml-7">
                    <img src={data.images[0].url} className="rounded-full w-60 h-64 my-5"></img>
                </div>
                <div className='flex gap-6 items-center flex-col justify-center'>
                    <div className="flex flex-col gap-1">
                        <p className="font-medium text-lg text-[white]">Artist</p>
                        <h1 className="text-5xl text-white font-bold">{data.name}</h1>
                        <h3 className="text-base text-white text-opacity-80 font-base">{formatNumber(data.followers.total)} người theo dõi</h3>
                    </div>
                    <div className='w-full'>
                        <h2 className="text-base text-white font-base">Genres</h2>
                        {
                            data.genres.map(item => (
                                <p className="text-sm text-white text-opacity-80 font-base">
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div style={{background: `linear-gradient(${backgroundColor}, black)`}} className="w-full pt-8 pb-32">
                <PlayButton />
                <ArtistTrack id={artistID} />
                <ArtistAlbum id={artistID} />
                <RelatedArtist id={artistID} />
                <ArtistAppear id={artistID} />
            </div>
        </div>
    );
}

function PlayButton() {
    return (
        <div className="flex flex-row ml-10 gap-5 -mt-5">
            <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                <BsPlayFill className="text-white text-3xl" />
            </button>
            <div className='flex items-center'>
                <button className='w-28 h-8 rounded-full border-solid border-[1px] border-[#EE5566] border-opacity-50 bg-[#EE5566] bg-opacity-80 text-white'>Follow</button>
            </div>
            <div className="flex justify-center items-center">
                <button>
                    <BsThreeDots className="text-[#EE5566] text-opacity-80 text-xl"/>
                </button>
            </div>
        </div>
      );
}

export default Artist;
