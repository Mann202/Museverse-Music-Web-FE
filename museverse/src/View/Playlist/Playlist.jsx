import React, {useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import ColorThief from 'colorthief';

import { BsPlayFill, BsThreeDots, BsPauseFill } from 'react-icons/bs';

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';
import {formatNumber} from './SplitNumber'
import PlaylistCard from './PlaylistCard';
import Headers from '../Header/Header';
import {chuyenDoiThoiGian} from './SplitNumber'
import { spotifyApi } from 'react-spotify-web-playback';
import Cookies from 'js-cookie';

function Playlist({setPlayingTrack, playingID, setPlayingID, setTrackInAlbum, setIsPlaying, playingTrack, isPlaying, playingData, setPlay}) {
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
            axios(`https://api.spotify.com/v1/playlists/${playlistID}?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.tracks.items) 
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

    return (
        <div>
            <Headers bgColor={backgroundColor}/>
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
                <PlayButton setPlay={setPlay} setIsPlaying={setIsPlaying} isPlaying={isPlaying} playingID={playingID} playlistID={playlistID} setPlayingTrack={setPlayingTrack} setPlayingID={setPlayingID} setTrackInAlbum={setTrackInAlbum}/>
                <div className="w-full flex flex-row flex-wrap gap-y-2 justify-center items-start pb-36 bg-opacity-30 bg-black pt-12">
                    <HeaderPlaylist />

                    {data.map((item, index) => (
                        <PlaylistCard
                        id={item.track.id} 
                        index={index}
                        name={item.track.name}
                        album={item.track.album}
                        date={item.added_at}
                        duration={item.track.duration_ms}
                        image={item.track.album.images[0].url}
                        artist={item.track.artists}
                        setPlayingTrack={setPlayingTrack}
                        uri={item.track.uri}
                        setTrackInAlbum={setTrackInAlbum}
                        playingTrack={playingTrack}
                        data={data}
                        playingData={playingData}
                        isPlaying={isPlaying}
                        setPlayingID={setPlayingID}
                        setPlay={setPlay}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function PlayButton({setPlay, playingID, playlistID, setPlayingTrack, setPlayingID, setTrackInAlbum, isPlaying, setIsPlaying}) {
    const [pause, setPause] = useState(false)

    function handleClick() {
        axios('https://accounts.spotify.com/api/token', {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
        },
        data: 'grant_type=client_credentials',
        method: 'POST'
      })
      .then(response => {
        axios(`https://api.spotify.com/v1/playlists/${playlistID}`, {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + response.data.access_token}
        })
        .then(response => {
          const tracks = response.data.tracks.items.map(album => album.track.uri);
          setPlayingTrack(tracks);
          setPlayingID(playlistID)
          setTrackInAlbum(0)
        })
        .catch(error => {
          console.error('Error fetching playlist tracks:', error);
        });
      })
      .catch(error => {
        console.error('Error fetching access token:', error);
      });
    }

    return (
        <div className="flex flex-row ml-10 gap-5 -mt-5">
            <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                {(playingID==playlistID) ? 
                isPlaying ? 
                    <BsPauseFill className="text-black text-3xl" onClick={() => {setPlay(false)}}/>
                    :
                    <BsPlayFill className="text-black text-3xl" onClick={() => {setPlay(true)}}/>
                : 
                <BsPlayFill className="text-black text-3xl" onClick={handleClick}/>}
            </button>
            <div className="flex justify-center items-center">
                <button>
                    <BsThreeDots className="text-[#EE5566] text-xl"/>
                </button>
            </div>
        </div>
      );
}

function HeaderPlaylist() {
    return(
        <>
            <div className="flex felx-row w-11/12 gap-7 pl-3 hover:rounded-lg mb-5 border-b-[1px] border-white border-opacity-20 pb-2">
                <div className="flex flex-row gap-8 w-5/12">
                    <div className="flex flex-row items-center">
                        <p className="text-white text-opacity-50 w-5">#</p>
                    </div>
                    <div>
                        <h3 className="text-white text-opacity-50 font-medium text-sm">
                            Title
                        </h3>
                    </div>
                </div>
                <div className="flex flex-row w-7/12 gap-32">
                    <div className="w-40 flex items-center">
                        <p className="text-white text-opacity-50 font-medium text-sm">Album</p>
                    </div>
                    <div className="w-60 flex items-center">
                        <p className="text-white text-opacity-50 font-medium text-sm">Added</p>
                    </div>
                    <div className="flex items-center w-16 justify-center">
                        <p className="text-white text-opacity-50 font-medium text-sm">Duration</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Playlist