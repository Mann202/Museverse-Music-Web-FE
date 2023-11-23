import React, { useEffect, useState } from 'react';
import Headers from '../Header/Header';
import { spotifyApi } from 'react-spotify-web-playback';
import Cookies from 'js-cookie';
import axios from 'axios'; 
import { Spotify } from '../../API/Credentials';
import Loading from '../Loading/Loading';

function Queue({setIDs, ids, queue, setQueue, device, playingTrack, playingData, next, setNext }) {
    const [items, setItems] = useState([]);
    useEffect(()=>{
        if(ids.length > 0) {
          spotifyApi.getQueue(Cookies.get('spotifyToken')).then(
            response=> {setItems(ids)
            setIDs([])
            }
          )
        } else {
          spotifyApi.getQueue(Cookies.get('spotifyToken')).then(
            response=> {setItems(response.queue)}
          )
        }
    },[])

    console.log(items)

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
        existingArray.forEach((item) => {
            playing.push(item)
        })

        setQueue(playing)
        setIDs(updatedItems)
        setItems(updatedItems)
      };

      return (
        <div className=' h-screen overflow-y-auto pb-32'>
          <Headers />
          <div className='flex justify-center mt-10'>
            <div className='w-11/12'>
              <h1 className='text-white text-xl font-bold'>Currently playing track</h1>
            </div>
          </div>
            <div className='flex justify-center mt-5'>
              <div className='w-10/12'>
                <div className='flex flex-row gap-3'>
                  <img src={playingData.image} className='w-12 h-12 rounded-lg'/>
                  <div>
                      <p className='text-white'>{playingData.name}</p>
                        <div className='flex flex-row'>
                          {playingData.artists.map((item, index) => (
                            <React.Fragment key={item.id}>
                              <p className='text-white text-opacity-80'>{item.name}</p>
                                {index < playingData.artists.length - 1 && <span className='text-white'>, </span>}
                            </React.Fragment>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-center mt-5'>
              <div className='w-11/12'>
                <h1 className='text-white text-xl font-bold'>Queue</h1>
              </div>
            </div>
          <div className='flex justify-center mt-5'>
            <div className='flex gap-y-5 flex-col w-10/12'>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, index)}
                  className='flex flex-row gap-3'
                >
                  <img src={item.album.images[0].url} className='w-12 h-12 rounded-lg'/>
                  <div>
                    <p className='text-white'>{item.name}</p>
                      <div className='flex flex-row'>
                        {item.artists.map((item, index) => (
                          <React.Fragment key={item.id}>
                            <p className='text-white text-opacity-80'>{item.name}</p>
                              {index < playingData.artists.length - 1 && <span className='text-white'>, </span>}
                          </React.Fragment>
                          ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
}

export default Queue;
