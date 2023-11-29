import React, { useEffect } from 'react'
import anh from '../../assets/images.jpg'
import { GoStarFill, GoStar } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";

const SoldAlbumCard = ({imgURL, album_physi_id, name, type, user_id, artist_id, min_price, max_price, description, key}) => {
    return (
        <div className='flex flex-col overflow-y-scroll h-screen'>
            <img className='w-[255px] h-[257px] rounded-md' src={imgURL} alt="album image" ></img>
            <div className='flex justify-between mt-3 text-[#EE5566] items-center'>
                <div className='flex '>
                    <GoStarFill />
                    <GoStarFill />
                    <GoStarFill />
                    <GoStarFill />
                    <GoStar />
                </div>
                <div >Reviews(4)</div>
            </div>
            <div className='w-[255px]'>{(name.length < 28) ? name : name.substring(0, 28 - 3) + '...'}</div>
            <div className='text-[#EE5566] flex justify-between items-center'>
                <div className='flex flex-col'>
                    <div className='text-gray-500 line-through'>$400</div>
                    <div className='text-lg font-semibold leading-[25.20px]'>{(min_price === max_price) ? min_price : {min_price}-{max_price}}</div>
                </div>
                <div className="w-[98px] h-[29px] px-5 py-2 rounded-[50px] border-2 border-rose-500 justify-start items-center gap-2.5 inline-flex">
                    <FaShoppingCart className='text-xl font-semibold' />
                    Add
                </div>
            </div>
        </div>
    )
}

export default SoldAlbumCard