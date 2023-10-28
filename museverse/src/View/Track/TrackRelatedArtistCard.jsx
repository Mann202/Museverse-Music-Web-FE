import React from 'react'
import { useNavigate } from 'react-router-dom'

function RelatedArtistCardTrack({id, name, image, dark}) {

    const navigate = useNavigate()

    function changeRoute() {
        const path = `/artist/${id}`
        navigate(path)
        window.location.reload();
    }

  return (
    <div
        className={`h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 cursor-pointer ${dark ? "bg-white bg-opacity-10 hover:bg-opacity-20" : "bg-black bg-opacity-30 hover:bg-opacity-60"}`}
        //onMouseEnter={() => setIsHovered(true)}
        //onMouseLeave={() => setIsHovered(false)}
        onClick={changeRoute}
         >
        <div className="relative overflow-hidden">
            <img src={image} alt="" className="rounded-full w-40 h-40 mt-3" />   
        </div>
        <div className="w-40 pb-4">
            <div className='flex flex-col gap-1 justify-center items-start'>
                <h3 className="font-semibold text-base text-white">
                    {name.length > 15 ? name.slice(0, 15) + '...' : name}
                </h3>
                <div className='flex justify-start'>
                    <p className='text-white text-opacity-70'>Artist</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RelatedArtistCardTrack