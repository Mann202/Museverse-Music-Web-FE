import React, { useState, useEffect, useRef } from 'react';
import { BsPlayFill, BsThreeDots, BsDot, BsHeart } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ColorThief from 'colorthief'

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import { formatNumber, chuyenNgay } from '../Playlist/SplitNumber';
import Headers from '../Header/Header';

const NewRelease = (id) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState('')
    const [image, setImage] = useState('')
    const [dark, setDark] = useState(false)
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
                axios(`https://api.spotify.com/v1/albums/0FZXUfdUtrkzNyzmT1VLlB`, {
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
              setBackgroundColor('#eaafc8');
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
        <div className="h-screen overflow-y-scroll flex flex-col w-full">
            <Headers bgColor={backgroundColor}/>
            <div className="flex flex-col gap-10 h-1/4" style={{background: `linear-gradient(${backgroundColor}, #654ea3)`}}>                
                <div className='flex h-full items-center text-[90px] font-bold text-white ml-5'>Mới phát hành</div>
            </div>
            <div className="flex flex-col gap-10 h-1/3" style={{background: `linear-gradient( #55428a, black)`}}>   
                <div className='text-white text-2xl font-bold mt-8 ml-5'>Những bản phát hành mới hay nhất</div>
            </div>
        </div>
    );
}


export default NewRelease