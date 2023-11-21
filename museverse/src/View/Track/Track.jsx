import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import ColorThief from 'colorthief'
import { useParams } from 'react-router-dom'

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading'
import { convertMsToMinSec } from '../Playlist/SplitNumber';
import {BsPauseFill, BsPlayFill, BsThreeDots} from 'react-icons/bs'
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai'
import ArtistTrack from './ArtistTrack';
import TopTrack from './TopTrack';
import ArtistAlbum from '../Artists/ArtistAlbum';
import Headers from '../Header/Header';
import RelatedArtistTrack from './RelatedArtistTrack';
import TopTrackAnother from './TopTrackAnother';
import ListAlbumHaveTrack from './ListAlbumHaveTrack';

function Track({playingData, isPlaying, setPlay, setPlayingTrack}) {
    const [data,setData] = useState([])
    const [lyric, setLyric] = useState([])
    const [backgroundColor, setBackgroundColor] = useState('')
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(true)
    const [artists, setArtists] = useState([])
    const [dark, setDark] = useState(false)

    const {trackID} = useParams()
    const imageRef = useRef(null)


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
            axios(`https://api.spotify.com/v1/tracks/${trackID}?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data)
                axios(`https://api.spotify.com/v1/artists/${response.data.artists[0].id}`, {
                  method: 'GET',
                  headers: {'Authorization': 'Bearer ' + token}
              })
              .then(artistResponse => {
                  setArtists(artistResponse.data)
                  setLoading(false)
              })
                setImage(response.data.album.images[0].url)
            })
            .catch(error => {
                console.error(error);
            });

            axios(`https://spotify-lyric-api-984e7b4face0.herokuapp.com/?url=https://open.spotify.com/track/${trackID}?autoplay=true`, {
                method: 'GET',
                headers: {}
            })
            .then(response => {
                setLyric(response.data.lines)
            })
        })
        .catch(error => {
            console.error(error);
        });
    }, [trackID]);

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

                if(brightness < 50) {
                  setDark(true)
              }

                if (brightness > 200) {
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


    if(loading) return <div><Loading /></div>
    return (
        <div>
          <Headers bgColor={backgroundColor} />
          <div style={{background: `linear-gradient(${backgroundColor}, black)`}} className="h-screen overflow-y-scroll pb-16">
            <div className="flex flex-col gap-10">
                <div className='flex flex-row gap-5'>
                    <img src={image} className='ml-8 mt-8 w-56 h-56' alt={data.name}></img>
                    <div className='flex flex-col gap-1 justify-end'>
                        <p className='font-medium text-lg text-[white]'>Track</p>
                        <div className='flex flex-col gap-3'>
                          <h2 className='text-5xl text-white font-bold'>{data.name}</h2>
                            <div className='flex flex-row gap-2'>
                              <div className='flex items-center'>
                                  <img src={artists.images[0].url} className='w-8 h-8 rounded-full' alt=""></img>
                                </div>
                              <div className='flex flex-row gap-3 items-center'>
                                <p className="text-white text-opacity-70">{data.artists[0].name}</p>
                                <p className="text-white text-opacity-70 font-bold">.</p>
                                <p className="text-white text-opacity-70">{data.album.name}</p>
                                <p className="text-white text-opacity-70 font-bold">.</p>
                                <p className="text-white text-opacity-70">{data.album.release_date}</p>
                                <p className="text-white text-opacity-70 font-bold">.</p>
                                <p className="text-white text-opacity-70">{convertMsToMinSec(data.duration_ms)}</p>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-black bg-opacity-40 pb-12'>
                      <div className='ml-8 mt-10'>
                        <PlayButton trackID={trackID} setPlayingTrack={setPlayingTrack} playingData={playingData} data={data} isPlaying={isPlaying} setPlay={setPlay}/>
                      </div>
                  <div className='flex flex-row justify-between'>
                    <div className='ml-10 mt-3'>
                      <h2 className='text-[#EE5566] text-2xl font-semibold text-opacity-90'>Lyric</h2>
                      <div className="mt-5">
                        {
                          (lyric.length == 0) ? 
                            (loading<5) 
                              ? <div><p className='text-white text-opacity-80 text-xl'>Loading lyric</p></div> 
                              : <div><p className='text-white text-opacity-80 text-xl'>Sorry, lyric of this track is not available</p></div> 
                            : lyric.map(item => (
                            <p className='text-white text-opacity-70'>{item.words}</p>
                          ))
                        }
                      </div>
                    </div>
                    <div className='flex flex-col gap-5 w-80 mr-10'>
                      {data.artists.map(item => (
                        <ArtistTrack id={item.id}/>
                      ))}
                    </div>
                  </div>

                  <div>
                    <TopTrack trackData={data} id={data.artists[0].id}/>
                    <ArtistAlbum id={data.artists[0].id} dark={dark}/>
                    <RelatedArtistTrack id={data.artists[0].id} dark={dark} />
                    <div>
                      {
                        data.artists.slice(1, data.artists.length).map(item => (
                          <TopTrackAnother id={item.id} dark={dark}/>
                        ))
                      }
                    </div>
                    <div>
                      <ListAlbumHaveTrack trackID={trackID} artistID={data.artists[0].id}/>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
    )
}

function PlayButton({trackID, playingData, data, isPlaying, setPlay, setPlayingTrack}) {
  const userId = 1
  const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function checkSaveStatus() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/getLikedSongID?user_id=${userId}&track_id=${trackID}`);
                if (response.data === "Yes") {
                    setSaved(true);
                } else {
                    setSaved(false);
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        }

        checkSaveStatus();
    }, [trackID]); 

  function handleClick() {
    setPlayingTrack(data.uri)
  }

  async function handleSave() {
    try {
        const data = {
            user_id: 1,
            track_id: trackID
        };
        await axios.post('http://127.0.0.1:8000/api/saveLikedSong', data);
        setSaved(true);
    } catch (error) {
        console.error('Error following artist:', error);
    }
}

async function handleUnsave() {
    try {
        const data = {
            user_id: 1,
            track_id: trackID
        };
        await axios.get('http://127.0.0.1:8000/api/unsaveSong', { params: data });
        setSaved(false); 
    } catch (error) {
        console.error('Error unfollowing artist:', error);
    }
}

  return (
      <div className="flex flex-row justify-start gap-5 -mt-5">
          {
            (playingData.name === data.name) 
            ?
              isPlaying
              ?
                <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                  <BsPauseFill onClick={()=> {setPlay(false)}} className="text-black text-3xl" />
                </button>
              :
              <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                  <BsPlayFill onClick={()=> {setPlay(true)}} className="text-black text-3xl" />
                </button>
            :
              <button className="bg-[#EE5566] rounded-full w-12 h-12 flex justify-center items-center">
                <BsPlayFill onClick={handleClick} className="text-black text-3xl" />
              </button>
          }
          <div className="flex justify-center items-center">
                  {(!saved) ?
                  <button onClick={handleSave}><AiOutlineHeart className="text-[#EE5566] text-opacity-80 text-3xl"/></button>
                  : <button onClick={handleUnsave}><AiFillHeart className="text-[#EE5566] text-opacity-80 text-3xl"/></button>
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


export default Track