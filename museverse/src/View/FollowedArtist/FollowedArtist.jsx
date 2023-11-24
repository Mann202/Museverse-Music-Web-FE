import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FollowedArtistCard from './FollowedArtistCard';
import Headers from '../Header/Header';
import Loading from '../Loading/Loading';

function FollowedArtist() {
  const user = localStorage.getItem('user');
  const userJson = JSON.parse(user);
  const userID = userJson.user_id;

  const [loading, setLoading] = useState(true);
  const [groupedData, setGroupedData] = useState({});
  const [renderPlaceholder, setRenderPlaceholder] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getAllFollowedArtist?user_id=${userID}`);
        const data = response.data;

        if (data.length === 0) {
          setRenderPlaceholder(true);
        } else {
          const grouped = {};

          data.forEach((item) => {
            const date = new Date(item.follow_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });

            if (!grouped[date]) {
              grouped[date] = [];
            }
            grouped[date].push(item);
          });

          setGroupedData(grouped);
        }

        setLoading(false);
      } catch (error) {
        // Xử lý lỗi nếu cần
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [userID]);

  if (renderPlaceholder) {
    return (
      <div>
        <Headers />
        <div className='pl-5 pt-5'>
          <p className='text-[#EE5566] font-bold text-xl'>Followed Artist</p>
        </div>
        <h2 className='text-[#EE5566] font-medium text-lg text-center pt-16'>
          Your followed artists is empty.
        </h2>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Headers />
      <div className='h-screen overflow-y-auto pb-32'>
        <div className='pl-5 pt-5'>
          <p className='text-[#EE5566] font-bold text-xl'>Followed Artists</p>
        </div>
        <div className='pt-10'>
          {Object.keys(groupedData).map((date) => (
            <div key={date}>
              <div className='flex justify-center'>
                <div className='w-11/12'>
                  <h2 className='text-[#EE5566] text-opacity-90 text-xl font-medium pt-3'>
                    {date}
                  </h2>
                </div>
              </div>
              <div className='flex flex-row justify-center pt-3 '>
                <div className='w-10/12 flex flex-row gap-7 flex-wrap'>
                  {groupedData[date].map((item) => (
                    <FollowedArtistCard key={item.artist_id} artistID={item.artist_id} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FollowedArtist;
