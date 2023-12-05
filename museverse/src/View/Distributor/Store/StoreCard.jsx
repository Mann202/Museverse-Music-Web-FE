import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spotify } from '../../../API/Credentials'

function StoreCard({data}) {
    
    return (
        <div className='hover:bg-[#323232] w-56 h-68 flex justify-center items-center rounded py-4'>
            <div className='w-11/12'>
                <div className="flex justify-center">
                    <img src={data.url_poster} className='h-36 w-36 rounded'/>
                </div>
                <div className='flex justify-center pt-3 ml-5'>
                    <div className='w-11/12'>
                        <p className='text-white font-semibold'>{data.album_name.length > 16 ? data.album_name.slice(0,15)+ "..." : data.album_name}</p>
                        <div>
                            <p className='text-white font-medium'>{data.type}</p>
                        </div>
                        <p className='text-white text-sm text-opacity-70'>{data.description.length > 40 ? data.description.slice(0,40) + "..." : data.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreCard