import React, { useEffect, useState } from 'react'
import anh from '../../assets/images.jpg'
import { GoStarFill, GoStar } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';

const SoldAlbumCard = ({ imgURL, album_physi_id, name, type, user_id, artist_name, artist_id, min_price, max_price, description, key }) => {
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(true)
    if(artist_name == '')
        artist_name = "Artist Name" 

    

    // if(loading) return <Loading/>;

    return (
        <div className='flex flex-col bg-[#181818] hover:bg-[#282828] p-4 text-white rounded-lg cursor-pointer ' onClick={() => navigate(`/albumsdetails/${album_physi_id}`)}>
            <img className='w-[255px] h-[257px] rounded-md' src={imgURL} alt="album image" ></img>
            <div className='w-[255px] mt-5'>{(name.length < 28) ? name : name.substring(0, 28 - 3) + '...'}</div>
            <div class="text-zinc-400 text-sm font-semibold">{artist_name}</div>
            <div className='text-[#EE5566] flex justify-between items-center'>
                <div className='text-lg font-semibold leading-[25.20px]'>{(min_price === max_price) ? min_price : `${min_price} - ${max_price}`} VND</div>
                {/* <div className="w-[98px] h-[29px] px-5 py-2 rounded-[50px] border-2 border-rose-500 justify-start items-center gap-2.5 inline-flex hover:bg-[#404040]">
                    <FaShoppingCart className='text-xl font-semibold' />
                    Add
                </div> */}
            </div>
        </div>
    )
}

export default SoldAlbumCard