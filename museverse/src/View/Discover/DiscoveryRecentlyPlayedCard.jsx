import React from 'react'

function DiscoveryRecentlyPlayedCard({image, name, id}) {
    return (
        <div className='flex flex-row h-12 w-[28%] bg-white bg-opacity-10 rounded-md gap-x-3' >
            <div>
                <img src={image} className='h-12 w-12 rounded-md'></img>
            </div>
            <div className='flex items-center'>
                <p className='text-white text-sm'>{name.length < 25 ? name : name.slice(0, 24) +"..."}</p>
            </div>
        </div>
    )
}

export default DiscoveryRecentlyPlayedCard