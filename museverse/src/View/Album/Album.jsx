import React, { useState, useEffect, useRef } from 'react';
import { BsPlayFill, BsThreeDots, BsDot, BsHeart, BsPauseFill } from 'react-icons/bs';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import ColorThief from 'colorthief'

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import { formatNumber, chuyenNgay } from '../Playlist/SplitNumber';
import AlbumTrack from './AlbumTrack';
import ArtistAlbum from '../Artists/ArtistAlbum';
import AnotherAlbum from './AnotherAlbum';
import Headers from '../Header/Header';

const Album = ({ playingAlbumID, setPlayingAlbumID, setPlayingTrack, setPlay, play, isPlaying, setTrackInAlbum, playingData }) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState('')
    const [image, setImage] = useState('')
    const [dark, setDark] = useState(false)
    const { albumID } = useParams();

    const imageRef = useRef(null);

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
                axios(`https://api.spotify.com/v1/albums/${albumID}`, {
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
    }, [albumID]);

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

    if (loading) {
        return <div><Loading /></div>
    }

    return (
        <div>
            <Headers bgColor={backgroundColor} />
            <div style={{ background: `linear-gradient(${backgroundColor}, black)` }} className="h-screen overflow-y-scroll flex flex-col pb-20 w-full">
                <div style={{ background: `${backgroundColor}` }} className="flex flex-row gap-10">
                    <div className="flex items-center ml-7">
                        <img src={data.images[0].url} className="rounded-full w-60 h-64 my-5"></img>
                    </div>
                    <div className='flex gap-6 items-center flex-col justify-center'>
                        <div>
                            <p className="font-medeium text-lg text-white capitalize">Album</p>
                            <div className='w-full overflow-hidden'>
                                <h1 className="whitespace-nowrap text-ellipsis overflow-hidden text-white font-bold text-[3vw]">{data.name}</h1>
                            </div>
                            <h3 className="text-base text-white text-opacity-80 font-base flex items-center">
                                {data.artists.map((item, index) => (
                                    <NavLink to={`/artist/${item.id}`} className='hover:underline hover:text-white items-center flex'>
                                        <React.Fragment key={item.id}>
                                            {item.name}
                                            {index !== data.artists.length - 1 && <BsDot />}
                                        </React.Fragment>
                                    </NavLink>
                                ))}
                                <BsDot />
                                {new Date(data.release_date).getFullYear()}
                                <BsDot />
                                {`${data.total_tracks} ${data.total_tracks === 1 ? 'track' : 'tracks'}`}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="w-full pb-32 bg-black bg-opacity-40 flex flex-col">
                    <PlayButton isPlaying={isPlaying} play={play} setPlay={setPlay} setPlayingTrack={setPlayingTrack} playingAlbumID={playingAlbumID} setPlayingAlbumID={setPlayingAlbumID} data={data}/>
                    <AlbumTrack
                        id={albumID}
                        playingAlbumID={playingAlbumID}
                        setPlayingAlbumID={setPlayingAlbumID}
                        setPlayingTrack={setPlayingTrack}
                        setPlay={setPlay}
                        play={play}
                        isPlaying={isPlaying}
                        setTrackInAlbum={setTrackInAlbum}
                        playingData={playingData}
                        AlbumData={data}
                    />
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
                        name={data.artists[0].name}
                        dark={dark}
                    />
                </div>
            </div>
        </div>
    );
}

function PlayButton({ playingAlbumID, setPlayingAlbumID, data, setPlayingTrack, setPlay, play, isPlaying }) {
    const { albumID } = useParams()

    function handleClick() {
        const track = []
        const tracksData = data.tracks.items
        setPlayingAlbumID(albumID)
        tracksData.forEach(item => {
            track.push(item.uri)
        })
        setPlayingTrack(track)
    }

    return (
        <div className="flex ml-10 gap-5 mt-5">
            {
                (albumID == playingAlbumID)
                    ?
                    isPlaying
                        ?
                        <button onClick={() => { setPlay(false) }} className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                            <BsPauseFill className="text-black text-3xl" />
                        </button>
                        :
                        <button onClick={() => { setPlay(true) }} className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                            <BsPlayFill className="text-black text-3xl" />
                        </button>
                    :
                    <button onClick={handleClick} className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                        <BsPlayFill className="text-black text-3xl" />
                    </button>
            }
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