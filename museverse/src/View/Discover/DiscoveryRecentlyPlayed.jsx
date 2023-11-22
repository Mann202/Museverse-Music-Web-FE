import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Spotify } from './../../API/Credentials';
import Loading from '../Loading/Loading';
import DiscoveryRecentlyPlayedCard from './DiscoveryRecentlyPlayedCard';

const DiscoveryRecentlyPlayed = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    
    function chaoTheoThoiGian() {
        var now = new Date();
        var hour = now.getHours();
    
        if (hour < 12) {
            return <h1 className='text-white text-2xl font-bold'>Good Morning!</h1>;
        } else if (hour < 18) {
            return <h1 className='text-white text-2xl font-bold'>Good Afternoon!</h1>; 
        } else {
            return <h1 className='text-white text-2xl font-bold'>Good Evening!</h1>; 
        }
    }

    useEffect(() => {
        const fetchHistory = async () => {
          try {
            const id = 1;
            const { data } = await axios.get(`http://127.0.0.1:8000/api/history?id=${id}`);
            const songIds = data.map(item => item.song_id);
      
            const tokenResponse = await axios('https://accounts.spotify.com/api/token', {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
              },
              data: 'grant_type=client_credentials',
              method: 'POST'
            });
      
            const trackData = await Promise.all(
              songIds.map(async (songId) => {
                const trackResponse = await axios(`https://api.spotify.com/v1/tracks/${songId}`, {
                  headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token }
                });
                return trackResponse.data;
              })
            );
      
            setData(trackData);
            setLoading(false);
          } catch (error) {
            console.error('Có lỗi xảy ra:', error);
          }
        };
      
        fetchHistory();
      }, []);
      
    if(loading) return <Loading />

    return (
        <div className='pt-5'>
            <div>{chaoTheoThoiGian()}</div>
            <div className='flex items-center justify-center pt-10'>
                <div className='w-11/12'>
                <div className='flex flex-row justify-between flex-wrap gap-x-12 gap-y-2'>
                    {
                        data.map(item => {
                            return(
                                    <DiscoveryRecentlyPlayedCard 
                                    image={item.album.images[0].url}
                                    name={item.name}
                                    id={item.id}
                                />
                            )
                        })
                    }
                </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoveryRecentlyPlayed;
