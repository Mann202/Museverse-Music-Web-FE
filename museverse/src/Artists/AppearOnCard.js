import React from 'react'

function AppearOnCard({id, image, name, type, release}) {
  
    return (
        <div
        className="bg-black bg-opacity-30 h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 hover:bg-opacity-60 cursor-pointer"
        //onMouseEnter={() => setIsHovered(true)}
        //onMouseLeave={() => setIsHovered(false)}
        //onClick={changeRoute}
        >
        <div className="relative overflow-hidden">
            <img src={image} className="rounded-xl w-40 h-40 mt-3" alt={name} />
        </div>
        <div className="w-40 pb-4">
            <div>
            <h3 className="font-semibold text-base text-white">
                {name.length > 15 ? name.slice(0, 15) + '...' : name}
            </h3>
            <p className="font-normal text-sm text-[#9898A6]">
                {release} . {type}
            </p>
            </div>
        </div>
        </div>
    )
}

export default AppearOnCard