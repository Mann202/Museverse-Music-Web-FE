import React, { useState, useEffect, useRef } from 'react';
import { BsPlayFill, BsThreeDots } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ColorThief from 'colorthief'

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import ArtistTrack from './ArtistTrack';
import ArtistAlbum from './ArtistAlbum';
import RelatedArtist from './RelatedArtist';
import Headers from '../Header/Header';
import ArtistAppear from './ArtistAppear';
import { formatNumber } from '../Playlist/SplitNumber';

function Artist() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState('')
    const [image, setImage] = useState('')
    const [dark, setDark] = useState(false)

    const { artistID } = useParams();

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
            axios(`https://api.spotify.com/v1/artists/${artistID}`, {
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + response.data.access_token}
            })
            .then(response => {
                setData(response.data)
                setImage(response.data.images[0].url)
                setLoading(false)
            })
        })
    }, [artistID]);
  
    useEffect(() => {
        const colorThief = new ColorThief();

        const loadImage = async () => {
            try {
              const img = new Image();
              img.crossOrigin = 'Anonymous';
              img.src = image;
              img.onload = () => {
                const color = colorThief.getColor(img);
                
                const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
                
                if(brightness < 50) {
                    setDark(true)
                }

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
        <div>
            <Headers bgColor={backgroundColor}/>
            <div style={{background: `linear-gradient(${backgroundColor}, black)`}} className="h-screen overflow-y-scroll flex flex-col gap-y-6 pb-20 w-full">
                <div style={{background: `${backgroundColor}`}} className="flex flex-row gap-10">
                    <div className="flex items-center flex-row ml-7">
                        {
                            (data.images.length == 0) 
                            ?
                            <img src="https://i.scdn.co/image/ab6761610000e5eb1020c22e0ce742eca7166e65" alt="" className='rounded-full w-60 h-64 my-5'></img>
                            :
                            <img src={data.images[0].url} alt={data.name} className="rounded-full w-60 h-64 my-5"></img>
                        }
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
                <div className="w-full pb-32">
                    <PlayButton artistID={artistID}/>
                    <ArtistTrack id={artistID} />
                    <ArtistAlbum id={artistID} dark={dark}/>
                    <RelatedArtist id={artistID} />
                    <ArtistAppear id={artistID} dark={dark}/>
                </div>
            </div>
        </div>
    );
}

function PlayButton({artistID}) {
    const [followed, setFollowed] = useState(false);

    useEffect(() => {
        async function checkFollowStatus() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/artistById?user_id=1&artist_id=${artistID}`);
                if (response.data === "Yes") {
                    setFollowed(true);
                } else {
                    setFollowed(false);
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        }

        checkFollowStatus();
    }, [artistID]); 

    async function handleClick() {
        try {
            const data = {
                user_id: 1,
                artist_id: artistID
            };
            await axios.post('http://127.0.0.1:8000/api/followArtist', data);
            setFollowed(true);
        } catch (error) {
            console.error('Error following artist:', error);
        }
    }

    async function handleUnfollow() {
        try {
            const data = {
                user_id: 1,
                artist_id: artistID
            };
            await axios.get('http://127.0.0.1:8000/api/unfollowArtist', { params: data });
            setFollowed(false); 
        } catch (error) {
            console.error('Error unfollowing artist:', error);
        }
    }
    return (
        <div className="flex flex-row ml-10 gap-5 -mt-5">
            <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                <BsPlayFill className="text-white text-3xl" />
            </button>
            <div className='flex items-center'>
                {
                    (!followed) 
                    ?
                    <button onClick={handleClick} className='w-28 h-8 rounded-full border-solid border-[1px] border-[#EE5566] border-opacity-50 bg-[#EE5566] bg-opacity-80 text-white'>Follow</button>
                    :
                    <button onClick={handleUnfollow} className='w-28 h-8 rounded-full border-solid border-[1px] border-[#EE5566] border-opacity-50 bg-[#EE5566] bg-opacity-80 text-white'>Followed</button>
                }
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
