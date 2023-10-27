import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import ColorThief from 'colorthief'
import { useParams } from 'react-router-dom'

import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading'
import { convertMsToMinSec } from '../Playlist/SplitNumber';
import {BsPlayFill, BsThreeDots} from 'react-icons/bs'
import {AiOutlineHeart} from 'react-icons/ai'
import ArtistTrack from './ArtistTrack';
import TopTrack from './TopTrack';
import ArtistAlbum from '../Artists/ArtistAlbum';
import RelatedArtistCard from '../Artists/RelatedArtistCard';
import RelatedArtistCardTrack from './RelatedArtistCardTrack';
import RelatedArtistTrack from './RelatedArtistTrack';
import TopTrackAnother from './TopTrackAnother';
import ListAlbumHaveTrack from './ListAlbumHaveTrack';

function Track() {
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
            axios(`https://api.spotify.com/v1/tracks/${trackID}?market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data)
                setImage(response.data.album.images[0].url)
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
            });

            //Lay lyric
            axios(`https://spotify-lyric-api-984e7b4face0.herokuapp.com/?url=https://open.spotify.com/track/${trackID}?autoplay=true`, {
                method: 'GET',
                headers: {}
            })
            .then(response => {
                setLyric(response.data.lines)
            })
            .catch(error => {
                console.error(error);
            });
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
        <div style={{background: `linear-gradient(${backgroundColor}, black)`}} className="h-screen overflow-y-scroll pb-16">
            <div className="flex flex-col gap-10">
                <div className='flex flex-row gap-5'>
                    <img src={image} className='ml-8 mt-8 w-56 h-56' alt={data.name}></img>
                    <div className='flex flex-col gap-1 justify-end'>
                        <p className='font-medium text-lg text-[white]'>Track</p>
                        <div className='flex flex-col gap-3'>
                          <h2 className='text-5xl text-white font-bold'>{data.name}</h2>
                            <div className='flex flex-row gap-3'>
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
                <div className='bg-black bg-opacity-40 pb-12'>
                  <div className='ml-8 mt-10'>
                    <PlayButton />
                  </div>
                  <div className='flex flex-row justify-between'>
                    <div className='ml-10 mt-3'>
                      <h2 className='text-[#EE5566] text-2xl font-semibold text-opacity-90'>Lyric</h2>
                      <div className="mt-5">
                        {
                          lyric.map(item => (
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

export default Track