import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spotify } from '../../API/Credentials'
import Loading from '../Loading/Loading'

function FollowedArtistCard({artistID}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [focus, setFocus] = useState(false)
    const navigate = useNavigate()

    function handleChange() {
        const path = `/artist/${artistID}`
        navigate(path)
      }

    useEffect(() => {
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
            .then(response => {
                const token = response.data.access_token;
                axios(`https://api.spotify.com/v1/artists/${artistID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => {
                    setData(response.data)
                    setLoading(false)
                })
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    if(loading) return <Loading />
    return(
        <div onClick={handleChange} className='bg-[#181818] hover:bg-[#282828] rounded-lg pb-7 pt-3 px-5 cursor-pointer'>
            <img src={data.images[0].url} className='w-36 h-36 rounded-lg'></img>
            <p className='text-white pt-2'>{data.name}</p>
        </div>
    )
}

export default FollowedArtistCard