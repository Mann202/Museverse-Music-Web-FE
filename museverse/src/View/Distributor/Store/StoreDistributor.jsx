import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Headers from '../../Header/Header';
import StoreCard from './StoreCard';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../../API/axios';

function StoreDistributor() {
    const [data,setData] = useState([])
    let userID = 0
    const user = localStorage.getItem('user')
    if(user != null) {
    const userJson = JSON.parse(user);
    console.log(userJson.user_id)
    userID = userJson.user_id;
  }

    useEffect(() => {
        axiosInstance.get(`/api/getAlbumDistributor?user_id=${userID}`).then(response => {
            setData(response.data)
        })
    },[])

    if(data.length === 0) return(
        <div>
            <Headers />
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-white font-semibold text-xl mb-4">
                    You don't have products in your store. Add new?
                </p>
                <NavLink to={`/newProduct`} className="text-white bg-[#EE5566] p-2 rounded">Add New</NavLink>
            </div>
        </div>
    )

    return (
        <div className='h-screen overflow-y-auto pb-32'>
            <Headers />
            <div className='pt-5'>
                <div className='flex justify-center'>
                    <div className='w-11/12'>
                        <p className='text-[#EE5566] font-bold text-xl'>Your store</p>
                        <div className='flex flex-row gap-5 pt-3'>
                            <p className='text-white text-lg'>All ({data.length})</p>
                            <NavLink to={`/newProduct`} className="text-white bg-[#EE5566] p-2 rounded">Add New</NavLink>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center'>
                    <div className='flex flex-row flex-wrap gap-5 gap-y-8 pt-10 w-10/12'>
                        {
                            data.map(item => {
                                return(
                                    <StoreCard data={item} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreDistributor