import React, { useEffect, useState } from 'react'
import Headers from '../Header/Header'
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import SoldAlbumCard from './SoldAlbumCard';
import Loading from '../Loading/Loading';
import axios from 'axios';
import { Spotify } from '../../API/Credentials';
const SoldAlbum = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false);
    const [load2, setLoad2] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let item = { album_physi_id: 0 };
                const response = await fetch("http://localhost:8000/api/getalbumphys", {
                    method: 'POST',
                    body: JSON.stringify(item),
                    headers: {
                        "Content-Type": 'application/json',
                        "Accept": 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setLoad(true);
                    setData(result);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchArtists = async () => {
            const array = [];
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                const id = element.artist_id;
                try {
                    const response = await axios('https://accounts.spotify.com/api/token', {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
                        },
                        data: 'grant_type=client_credentials',
                        method: 'POST'
                    });

                    const artistResponse = await axios(`https://api.spotify.com/v1/artists/${id}`, {
                        method: 'GET',
                        headers: { 'Authorization': 'Bearer ' + response.data.access_token }
                    });

                    array.push({ name: artistResponse.data.name, index: i });
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            setArtists(array);
            setLoad2(true);
        };

        if (data.length > 0) {
            fetchArtists();            
        }
    }, [data]);
    

    // console.log("artists", artists);

    // if (!load || !load2) return <Loading />;

    if (!load) return <Loading />;


    return (
        <div className='h-screen overflow-y-scroll'>
            <Headers />
            <div className='flex justify-between w-full h-[10%] mt-3 items-center'>
                <div className='text-[#EE5566] ml-5'>Albums</div>
                <div className='mr-4 '>
                    <div className="flex gap-2 ml-4">
                        <button onClick={() => { navigate('/shoppingcart') }} className={`text-[#EE5566] bg-[#131313] hover:bg-[#262626] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white`}>
                            <FaShoppingCart className='text-xl font-semibold' />
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`text-[#EE5566] bg-[#131313] hover:bg-[#262626] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "active:bg-[#EE5566] active:text-white"}`}
                        >
                            <AiOutlineLeft className='text-xl font-semibold' />
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
                            className={`text-[#EE5566] bg-[#131313] hover:bg-[#262626] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg ${currentPage === Math.ceil(data.length / itemsPerPage) ? "opacity-50 cursor-not-allowed" : "active:bg-[#EE5566] active:text-white"}`}
                        >
                            <AiOutlineRight className='text-xl font-semibold' />
                        </button>
                    </div>

                </div>
            </div>
            <div className='flex gap-5 flex-wrap w-full justify-center mb-5'>
                {data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => {
                    const artist = artists.find(a => a.index == index);
                    const artistName = artist ? artist.name : '';              
                    return (
                        <SoldAlbumCard
                            key={index}
                            imgURL={item.url_poster}
                            album_physi_id={item.album_physi_id}
                            name={item.album_name}
                            type={item.type}
                            user_id={item.user_id}
                            artist_id={item.artist_id}
                            artist_name={artistName}
                            min_price={item.min_price}
                            max_price={item.max_price}
                            description={item.description}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default SoldAlbum