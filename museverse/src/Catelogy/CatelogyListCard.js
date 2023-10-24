import React, { useState } from 'react';
import { BsPlayFill } from 'react-icons/bs';

function CatelogyListCard({ id, name, description, image }) {
  const [isHovered, setIsHovered] = useState(false);

  let cleanedDescription = description.replace(/<.*?>/g, '');

  return (
    <div
      className="bg-[#181818] h-76 w-48 flex flex-col items-center rounded-lg gap-y-3 hover:bg-[#282828]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img src={image} className="rounded-xl w-40 h-40 mt-3" alt={name} />
        { isHovered ?
          <div className={`absolute bottom-0 right-0 p-2 transtion-all overflow-hidden`}>
            <ButtonPlay />
          </div> : ""
        }
      </div>
      <div className="w-40 pb-4">
        <div>
          <h3 className="font-semibold text-base text-white">
            {name.length > 15 ? name.slice(0, 15) + '...' : name}
          </h3>
          <p className="font-normal text-sm text-[#9898A6]">
            {cleanedDescription.length > 40
              ? cleanedDescription.slice(0, 40) + '...'
              : cleanedDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

function ButtonPlay() {
  return (
    <button className="bg-[#1ED760] rounded-full w-12 h-12 flex justify-center items-center">
      <BsPlayFill className="text-black text-3xl" />
    </button>
  );
}

export default CatelogyListCard;
