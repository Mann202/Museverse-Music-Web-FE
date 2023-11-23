import React, { useEffect, useState } from 'react';
import Headers from '../Header/Header';
import { spotifyApi } from 'react-spotify-web-playback';
import Cookies from 'js-cookie';
import axios from 'axios'; 
import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';

function Queue({ setQueue, device, playingTrack, playingData, next, setNext }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true)
    const [play, setPlay] = useState([])

    useEffect(()=>{
        spotifyApi.getQueue(Cookies.get('spotifyToken')).then(
            response=> {setItems(response.queue)}
        )
    },[])

    useEffect(()=>{
        if(next) {
            const updatedItems = items.filter((item) => item.id !== playingData.id);
            setItems(updatedItems);
            setNext(false)
        }
    },[playingData])

    useEffect(()=>{
      
          const updatedItems = items.filter((item) => item.id !== playingData.id);
          setItems(updatedItems);
      
  },[playingData])

    const onDragStart = (e, index) => {
        e.dataTransfer.setData('index', index);
      };
    
      const onDragOver = (e) => {
        e.preventDefault();
      };
    
      const onDrop = (e, newIndex) => {
        e.preventDefault();
        const oldIndex = e.dataTransfer.getData('index');
        const updatedItems = [...items];
        const [draggedItem] = updatedItems.splice(oldIndex, 1);
        updatedItems.splice(newIndex, 0, draggedItem);

        const uris = updatedItems.map((item) => item.uri);
        const existingArray = []; 

        existingArray.push(...uris);
        const playing = []
        console.log(playingTrack)
        existingArray.forEach((item) => {
            playing.push(item)
        })

        setQueue(playing)

        setItems(updatedItems)
      };

      return (
        <div>
          <Headers />
          <h1 className='text-white text-xl font-bold'>Currently playing track</h1>
            
          <h1 className=' text-white text-xl font-bold'>Queue</h1>
          <ul>
            {items.map((item, index) => (
              <li
                key={item.id}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, index)}
                className='text-white'
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      );
}

export default Queue;
