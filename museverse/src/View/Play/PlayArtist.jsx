import React, {useState, useEffect} from 'react'
import axios from 'axios'

import { Spotify } from '../../API/Credentials'
import { NavLink } from 'react-router-dom';

function PlayArtist({playingData}) {
    const extractIdFromUrl = (url) => {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
      };

    const updatedPlayingData = {
        ...playingData,
        artists: playingData.artists.map((artist) => ({
          ...artist,
          id: extractIdFromUrl(artist.url)
        })),
    };

    const artists = updatedPlayingData.artists

    return (
        <div className="flex flex-row"> 
            {
                artists.map(item => (
                    <NavLink to={`/artist/${item.id}`} className="text-white text-sm hover:underline">{item.name}</NavLink>
                ))
            }
        </div>
    )
}

export default PlayArtist