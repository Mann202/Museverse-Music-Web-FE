import React, { useEffect, useRef, useState } from 'react';
import Headers from '../Header/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../Loading/Loading';
import ColorThief from 'colorthief';
import { Spotify } from '../../API/Credentials';
import { spotifyApi } from 'react-spotify-web-playback';
import Cookies from 'js-cookie';

function Lyric({isPlaying, progressMs, device, setProgressMs }) {
    const [lyric, setLyric] = useState([]);
    const [loading, setLoading] = useState(true);
    const { trackID } = useParams();
    const [dark, setDark] = useState(false);
    const [track, setTrack] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('');
    const [image, setImage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const imageRef = useRef(null);
    const refs = useRef([]);

    function handleChange(startTimeMs) {
        return () => {
            const spotifyToken = Cookies.get('spotifyToken');
            spotifyApi.seek(spotifyToken, startTimeMs, device);
            setProgressMs(parseInt(startTimeMs))
        };
    }

    useEffect(() => {
        const storedToken = "BQCuwAJpxUKpGOslaujZOkU5fMe3-YYQ0En9eCGVVrUg0KuScNiyyE5mabYxgzGu5ZYhLijrhqkTkcVrBQb2ET5a5cEK5T7pdgyRREBxviUc-G7TBo8zM-iUwuJ20sGP4iENrQILNn-KZCOCPsHzTWaPbImYAVin30oScdR8w6MKq4ILVSV79Bd2WLmCjTls875W3rJaZRMJZlu_WES6f_rI5qp3N4ZbUjyuuDgszalvtI6oSpsff0xGeizAsq93-4vEzCYwFg85vF9XBjMxRGD169SscBOZfngpIPN79AimeRYTbY7yWtiXq1897l-TpXPSplwx3tQ82WV8LHsxgs4kZebC8Gt4";
            //Lay lyric 
            axios.get(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackID}/image/https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b27325e6b25d49687cd63f7a034e?format=json&vocalRemoval=false&market=from_token`, {
                headers: {
                    "App-platform": "WebPlayer",
                    "Authorization": `Bearer ${storedToken}`,
                    "Client-Token": "AAAx6DaZrQcDZhwL1iDl4fHVROgUuanebp5okN4f4ybRbZJfJ2wwwXoq88mvHIAc7mGxhxPh8842Ppm7ZNhnLufmTT/GW62P5srJVXAJMbhv5dUIcbxuRnsSuIbwQCGaNVyg99YNypUgV4y6KWIVc8NfgLwEyE8ZBjG+iFkhxIYiVykExXFghgEyw1V9Qkc3kN1JjjEqOizEUYsX3I7wDgkdfkAiAhuas+iWk8/lEgscBlH2ODyehfmYk1gfZ7xg3DJrrd4NfHuyTtY1dna4kAH1iY63D6ZX+RnUX+nUKkHfa9I="
                }
            })
            .then(response => {
                setLyric(response.data.lyrics.lines)
            })

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
            }).then(response => {
                setTrack(response.data);
                setImage(response.data.album.images[0].url);
                setLoading(false);
            });
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

                    if (brightness < 50) {
                        setDark(true);
                    }

                    if (brightness > 150) {
                        const darkenedColor = [
                            Math.max(0, color[0] - 75),
                            Math.max(0, color[1] - 75),
                            Math.max(0, color[2] - 75),
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

    useEffect(() => {
        const storedToken = Cookies.get("spotifyToken");
        
        const fetchPlaybackState = async () => {
          try {
            const response = await spotifyApi.getPlaybackState(storedToken);
            setProgressMs(response.progress_ms);
          } catch (error) {
            console.error("Error fetching playback state:", error);
          }
        };
      
        const intervalId = setInterval(fetchPlaybackState, 500);
      
        return () => {
          clearInterval(intervalId);
        };
      }, []);
      

    useEffect(() => {
        const checkLyricMatch = () => {
            const currentProgressMs = progressMs;

            for (let i = 0; i < lyric.length; i++) {
                const item = lyric[i];
                const lyricStartTimeMs = parseInt(item.startTimeMs, 10);
                const nextItem = lyric[i + 1];

                let lyricEndTimeMs = 0;
                if (nextItem) {
                    lyricEndTimeMs = parseInt(nextItem.startTimeMs, 10);
                }

                if (currentProgressMs >= lyricStartTimeMs && currentProgressMs < lyricEndTimeMs) {
                    refs.current.forEach((ref) => {
                        ref.classList.remove('text-[#EE5566]');
                    });

                    refs.current[i].classList.add('text-[#EE5566]');
                    setCurrentIndex(i); 
                }
            }
        };

        checkLyricMatch();
    }, [progressMs, lyric]);

    if (loading) return <Loading />;
    return (
        <div style={{ background: `linear-gradient(${backgroundColor}, black)` }} className='h-screen overflow-y-auto pb-32 '>
            <Headers bgColor={backgroundColor} />
            <div className='flex justify-center pt-10'>
                <div className='w-11/12'>
                    <div>
                        {lyric.map((item, indexItem) => (
                            <div key={indexItem}>
                                <p
                                    ref={(ref) => (refs.current[indexItem] = ref)}
                                    onClick={handleChange(item.startTimeMs)}
                                    className={`font-semibold text-xl pt-2 text-opacity-80 cursor-pointer ${
                                        currentIndex === indexItem ? 'text-[#EE5566]' : 'text-white'
                                    }`}
                                    style={{ display: 'inline-block' }} 
                                >
                                    {item.words}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default Lyric;