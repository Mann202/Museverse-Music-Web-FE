import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Spotify } from '../../API/Credentials';
import { useParams } from 'react-router-dom';
import ColorThief from 'colorthief'
import Headers from '../Header/Header';
import { extractMonthYear } from '../Show/ShowCard';
import { convertMsToMinSec } from '../Playlist/SplitNumber';
import Loading from '../Loading/Loading';
import { BsPauseFill, BsPlayFill, BsThreeDots } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';

function Episode({playingData, isPlaying, setPlay, setPlayingTrack}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [dark, setDark] = useState('')
    const [image, setImage] = useState('')
    const [backgroundColor, setBackgroundColor] = useState('')
    const {episodeID} = useParams() 
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
            axios(`https://api.spotify.com/v1/episodes/${episodeID}?market=VN`, {
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
        })
    }, []);

    useEffect(() => {
    const colorThief = new ColorThief()
    const imageElement = imageRef.current

    const loadImage = async () => {
      try {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = image
        img.onload = () => {
          const color = colorThief.getColor(img)

          const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000

          if (brightness < 50) {
            setDark(true)
          }

          if (brightness > 160) {
            const darkenedColor = [
              Math.max(0, color[0] - 100),
              Math.max(0, color[1] - 100),
              Math.max(0, color[2] - 100),
            ]
            const hexColor = `#${darkenedColor[0]
              .toString(16)
              .padStart(2, '0')}${darkenedColor[1]
              .toString(16)
              .padStart(2, '0')}${darkenedColor[2].toString(16).padStart(2, '0')}`
            setBackgroundColor(hexColor)
          } else {
            const darkenedColor = [
              Math.max(0, color[0] - 15),
              Math.max(0, color[1] - 15),
              Math.max(0, color[2] - 15),
            ]
            const hexColor = `#${darkenedColor[0]
              .toString(16)
              .padStart(2, '0')}${darkenedColor[1]
              .toString(16)
              .padStart(2, '0')}${darkenedColor[2].toString(16).padStart(2, '0')}`
            setBackgroundColor(hexColor)
          }
        }
      } catch (error) {
        console.error('Lỗi tải hình ảnh:', error)
      }
    }

    loadImage()
  }, [image])

    console.log(data)

    if(loading) return <Loading /> 
    return (
        <div>
            <Headers bgColor={backgroundColor}/>
            <div style={{background: `linear-gradient(${backgroundColor}, black)`}} className="h-screen overflow-y-scroll pb-16">
                <div className='flex flex-row gap-5'>
                    <div>
                        <img src={image} className='ml-8 mt-8 w-56 h-56 rounded-lg' alt={data.name} />
                    </div>

                    <div className='flex justify-center flex-col gap-4'>
                        <p className='font-medium text-lg text-[white]'>Podcast Episode</p>
                        <p className='text-5xl text-white font-bold'>{data.name}</p>
                        <p className='text-white text-xl font-semibold'>{data.show.name}</p>
                    </div>
                </div>

                <div className='bg-black bg-opacity-10 mt-5 pt-5 pb-32'>
                    <div className='flex flex-row gap-2 ml-10'>
                        <div className="flex items-center">
                            <p className='text-white text-opacity-70'>{extractMonthYear(data.release_date)}</p>
                        </div>

                        <div className='flex justify-center '>
                            <p className='text-white text-opacity-70 font-bold'>.</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <button>
                            <p className='text-white text-opacity-70'>{convertMsToMinSec(data.duration_ms)}</p>
                            </button>
                        </div>
                    </div>

                    <div className='mt-10 ml-10'>
                        <PlayButton setPlayingTrack={setPlayingTrack} playingData={playingData} data={data} isPlaying={isPlaying} setPlay={setPlay}/>
                    </div>

                    <div className='w-4/12 ml-10 pt-5'>
                        <p className='text-white font-extrabold text-2xl'>Episode Description</p>
                        <div className='pt-5'>
                            <p className='text-white text-opacity-70'>{data.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PlayButton({playingData, data, isPlaying, setPlay, setPlayingTrack}) {

    function handleClick() {
      setPlayingTrack(data.uri)
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

export default Episode