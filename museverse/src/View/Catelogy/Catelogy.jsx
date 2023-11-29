import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ColorThief from 'colorthief';
import axios from 'axios';

import { Spotify } from '../../API/Credentials';

import CatelogyCard from './CatelogyCard';
import Loading from '../Loading/Loading';
import Headers from '../Header/Header';

function Catelogy({setPlayingTrack, setPlayingID, playingID, setTrackInAlbum}) {
  const [data, setData] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [preData, setPreData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [image, setImage] = useState('')
  
  const { catelogyID } = useParams();
  const imageRef = useRef(null);

  const ClientID = Spotify.ClientID;
  const ClientSecret = Spotify.ClientSecret;

  useEffect(() => {
    async function fetchData() {
      try {
        // Gọi API để lấy token
        const tokenResponse = await axios('https://accounts.spotify.com/api/token', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(ClientID + ':' + ClientSecret)
          },
          data: 'grant_type=client_credentials',
          method: 'POST'
        });

        const categoryResponse = await axios(`https://api.spotify.com/v1/browse/categories/${catelogyID}?country=VN`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + tokenResponse.data.access_token
          }
        });

        setPreData(categoryResponse.data);
        setImage(categoryResponse.data.icons[0].url)

        const playlistsResponse = await axios(`https://api.spotify.com/v1/browse/categories/${catelogyID}/playlists?country=VN`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + tokenResponse.data.access_token
          }
        });

        const filteredCategoryData = playlistsResponse.data.playlists.items.filter(item => item !== null);  
        console.log(filteredCategoryData)
        setData(filteredCategoryData); // Lưu dữ liệu từ API vào state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error(error);
      }
    }

    fetchData(); // Call the asynchronous function
  }, [catelogyID, ClientID, ClientSecret]);

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

  if (loading) {
    return <div><Loading /></div>;
  }else{
    console.log("cate data",data);
    console.log("cate predata",preData);

  }

  return (
    <div>
      <Headers bgColor={backgroundColor} />
      <div style={{background: `linear-gradient(${backgroundColor}, black)`}} className="h-screen bg-gradient-to-b from-white to-black overflow-y-scroll flex flex-col gap-y-10">
        <div className="flex flex-row items-center gap-5">
          <img src={preData.icons[0].url} alt="Category Icon" className="rounded-lg ml-5 mt-5"></img>
          <div>
            <p className="font-normal text-base text-white">Catelogy</p>
            <h1 className="text-7xl font-bold text-white">{preData.name}</h1>
          </div>
        </div>
        <div className="w-full flex flex-row flex-wrap gap-5 gap-y-7 justify-center items-start pb-36 bg-opacity-30 bg-black pt-16">
          {data.map(item => (
          <CatelogyCard 
              id={item.id}
              name={item.name}
              description={item.description}
              image={item.images[0].url}
              setPlayingTrack={setPlayingTrack}
              setPlayingID={setPlayingID}
              playingID={playingID}
              setTrackInAlbum={setTrackInAlbum}
          />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Catelogy;
