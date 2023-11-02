import React from 'react'
import { useNavigate } from 'react-router'

function SearchingPlaylistCard({id, name, type, img, artists}) {
    const navigate = useNavigate()

    function handleClick() {
        const path=`/playlist/${id}`
        navigate(path)
    }

  return (
    <div onClick={handleClick} className='flex flex-col gap-3 bg-white bg-opacity-10 w-48 rounded-lg pb-2 hover:cursor-pointer'>
        <div className='flex justify-center'>
            <img src={img} alt="" className='w-40 h-40 mt-2 rounded-lg' />
        </div>
        <div className='flex justify-center'>
            <div className='flex flex-col w-9/12'>
                <p className='text-white font-semibold'>{(name.length > 14 ? name.slice(0,13) + '...' : name)}</p>
                <div>
                    <p className='text-white text-sm'>{type}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SearchingPlaylistCard