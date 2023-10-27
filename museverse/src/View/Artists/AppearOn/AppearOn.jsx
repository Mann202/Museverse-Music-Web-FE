import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Spotify } from '../../../API/Credentials';
import { chuyenNgay, capitalizeFirstLetter } from '../../Playlist/SplitNumber';

function AppearOn() {
  const [data, setData] = useState([])
  const {artistID} = useParams()

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
            axios(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=appears_on&market=VN`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data.items)
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [artistID]);

    console.log(data)

  return (
    <div className='h-screen overflow-y-scroll'>
      <div className='mt-5 ml-8'>
        <h3 className='font-semibold text-[#EE5566] text-lg'>Appear On</h3>
      </div>
      <div className='flex justify-center mt-5'>
        <div className='w-10/12'>
          <div className="flex flex-row flex-wrap gap-7 pb-32">
            {data.map(item => (
                <div
                className={`bg-black bg-opacity-30 hover:bg-opacity-60 h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 cursor-pointer`}
                //onMouseEnter={() => setIsHovered(true)}
                //onMouseLeave={() => setIsHovered(false)}
                //onClick={changeRoute}
                >
                  <div className="relative overflow-hidden">
                      <img src={item.images[0].url} className="rounded-xl w-40 h-40 mt-3" alt={item.name} />
                  </div>
                  <div className="w-40 pb-4">
                      <div>
                        <h3 className="font-semibold text-base text-white">
                            {item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name}
                        </h3>
                        <p className="font-normal text-sm text-[#9898A6]">
                            {chuyenNgay(item.release_date)}
                        </p>
                        <div>
                          <p className="font-normal text-sm text-[#9898A6]">
                              {capitalizeFirstLetter(item.type)}
                          </p>
                        </div>
                      </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppearOn