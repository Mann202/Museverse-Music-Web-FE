import React, { useEffect, useState } from 'react'
import Headers from '../Header/Header'
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import SoldAlbumCard from './SoldAlbumCard';
import Loading from '../Loading/Loading';
const SoldAlbum = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null)
    const [load, setLoad] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/getalbumphys", {
                    method: 'POST',
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

    if (!load) return <Loading />;

    return (
        <div className='text-white'>
            <Headers />
            <div className='flex justify-between w-full h-[10%] mt-3 items-center'>
                <div className='text-[#EE5566] ml-5'>Albums</div>
                <div className='mr-4 '>
                    <div className="flex gap-2 ml-4">
                        <button onClick={() => { navigate(-1) }} className={`text-[#EE5566] bg-[#131313] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white`}>
                            <FaShoppingCart className='text-xl font-semibold' />
                        </button>
                        <button onClick={() => { navigate(-1) }} className={`text-[#EE5566] bg-[#131313] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white`}>
                            <AiOutlineLeft className='text-xl font-semibold' />
                        </button>
                        <button onClick={() => { navigate(1) }} className="text-[#EE5566] bg-[#131313] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white">
                            <AiOutlineRight className='text-xl font-semibold' />
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex gap-5 flex-wrap ml-5 mt-4 w-full'>
                {data.map((item, index) => (
                    <SoldAlbumCard
                        key={index}
                        imgURL={item.url_poster}
                        album_physi_id={item.album_physi_id}
                        name={item.album_name}
                        type={item.type}
                        user_id={item.user_id}
                        artist_id={item.artist_id}
                        min_price={item.min_price}
                        max_price={item.max_price}
                        description={item.description}
                    />
                ))}
            </div>
        </div>
    )
}

export default SoldAlbum