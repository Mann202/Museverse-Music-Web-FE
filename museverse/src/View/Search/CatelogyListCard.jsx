import React, { useState, useEffect, useRef } from 'react';
import ColorThief from 'colorthief';
import { NavLink, useNavigate } from 'react-router-dom';

function CatelogyListCard({ name, image, id }) {
  const [backgroundColor, setBackgroundColor] = useState('');
  const imageRef = useRef(null);
  const navigate = useNavigate()

  
  const routeChange = () =>{ 
      let path = `/search/${id}`; 
      navigate(path);
    }
  

  useEffect(() => {
    const colorThief = new ColorThief();
    const imageElement = imageRef.current;

    const loadImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = image;
        img.onload = () => {
          const color = colorThief.getColor(img);
          const hexColor = `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`;
          setBackgroundColor(hexColor);
        };
      } catch (error) {
        console.error('Lỗi tải hình ảnh:', error);
      }
    };

    loadImage();
  }, [image]);
  

  return (
    <div style={{backgroundColor: backgroundColor}} className={`w-48 h-48 rounded-lg flex justify-end items-end flex-col overflow-hidden cursor-pointer`} onClick={routeChange}>
      <NavLink to={`/search/${id}`} className='h-full w-full pl-2 pt-2 text-white font-bold text-xl'>
        <h1 id={id}>{name}</h1>
      </NavLink>
      <img ref={imageRef} src={image} alt={name} className="w-32 h-32 rounded rotate-[15deg]" />
    </div>
  );
}

export default CatelogyListCard;
