import React from 'react'
import { useNavigate } from 'react-router-dom'

function RelatedArtistCard({id, name, image}) {

    const navigate = useNavigate()

    function changeRoute() {
        const path = `/artist/${id}`
        navigate(path)
        window.location.reload();
    }

  return (
    <div
        className="bg-transparent h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 hover:bg-opacity-60 cursor-pointer"
        //onMouseEnter={() => setIsHovered(true)}
        //onMouseLeave={() => setIsHovered(false)}
        onClick={changeRoute}
         >
        <div className="relative overflow-hidden">
            <img src={image} className="rounded-xl w-48 h-48 mt-3" />
                    
        </div>
        <div className="w-40 pb-4">
            <div className='flex justify-center'>
            <h3 className="font-semibold text-base text-white">
                {name.length > 15 ? name.slice(0, 15) + '...' : name}
            </h3>
            </div>
        </div>
        </div>
  )
}

export default RelatedArtistCard