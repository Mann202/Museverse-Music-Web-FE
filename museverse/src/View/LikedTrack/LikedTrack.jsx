import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Headers from '../Header/Header';
import HistoryCard from '../../History/HistoryCard';
import { chuyenNgay } from '../Playlist/SplitNumber';

function LikedTrack({currentPlay, setPlay, setTrackInAlbum, playingTrack, setPlayingTrack, playingData, isPlaying, setPlayingID}) {
    const userID = 1
    const [groupedData, setGroupedData] = useState({});
    const [renderPlaceholder, setRenderPlaceholder] = useState(false);
    const [data, setData] = useState([])
    
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/getAllLikedSong?user_id=${userID}`)
        .then(response => {
            setData(response.data); 
        })
    }, []);

    const groupDataByDate = () => {
        const grouped = {};
        data.forEach((item) => {
            const date = new Date(item.created_at).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
        });
        setGroupedData(grouped);
    };

    useEffect(() => {
        groupDataByDate();
    }, [data]); 


    useEffect(() => {
        const timeoutId = setTimeout(() => {
        if (!data.length) {
            setRenderPlaceholder(true);
        }
        }, 1000); 

        return () => {
        clearTimeout(timeoutId);
        };
    }, [data]);

  if (renderPlaceholder) {
    return (
      <div>
        <Headers />
        <div className='pl-5 pt-5'>
          <p className='text-[#EE5566] font-bold text-xl'>Liked tracks</p>
        </div>
        <h2 className='text-[#EE5566] font-medium text-lg text-center pt-16'>
          You don't have any liked track.
        </h2>
      </div>
    );
  }
    
    return (
        <div className='h-screen overflow-y-auto pb-32'>
            <Headers />
            <div className='pl-5 pt-5'>
                <p className='text-[#EE5566] font-bold text-xl'>Liked tracks</p>
            </div>
            <div className='pt-10'>
                {Object.keys(groupedData).map((date) => (
                    <div key={date}>
                        <div className='flex justify-center'>
                            <div className='w-11/12'>
                                <h2 className='text-[#EE5566] text-opacity-90 text-xl font-medium pt-3'>
                                {isToday(date) ? "Today" : (isYesterday(date) ? "Yesterday" : chuyenNgay(date))}
                                </h2>
                            </div>
                        </div>
                        {groupedData[date].map((item) => (
                            <HistoryCard track_id={item.song_id} 
                            setPlay={setPlay} playingData={playingData} setPlayingTrack={setPlayingTrack} playingTrack={playingTrack} setPlayingID={setPlayingID} setTrackInAlbum={setTrackInAlbum} isPlaying={isPlaying}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function isToday(dateString) {
    const today = new Date();
    const inputDate = new Date(dateString);

    return (
        inputDate.getDate() === today.getDate() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getFullYear() === today.getFullYear()
    );
}

function isYesterday(dateString) {
    const today = new Date();
    const yesterday = new Date(today);
    const inputDate = new Date(dateString);
    yesterday.setDate(today.getDate() - 1);
    return (
        inputDate.getDate() === yesterday.getDate() &&
        inputDate.getMonth() === yesterday.getMonth() &&
        inputDate.getFullYear() === yesterday.getFullYear()
    );
}

export default LikedTrack