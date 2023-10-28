import React, {useState, useEffect} from 'react'
import axios from 'axios';

import { Spotify } from '../../API/Credentials';
import { useNavigate } from 'react-router-dom';

function ArtistTrack({id}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    function handleChange() {
        const path = `/artist/${data.id}`
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
            axios(`https://api.spotify.com/v1/artists/${id}`, {
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + response.data.access_token}
            })
            .then(response => {
                setData(response.data)
                setLoading(false)
            })   
        })
    }, [id]);

    if(loading) return <div>Loading..</div>

    return (
        <div onClick={handleChange} className="flex flex-row gap-5 hover:bg-white hover:bg-opacity-30 hover:rounded-lg py-2 pr-10">
            <div className='ml-2'>
                <img src={data.images[0].url} alt="" className="w-24 h-24 rounded-full"></img>
            </div>
            <div className="flex flex-col justify-center">
                <p className="font-medium text-sm text-white text-opacity-80">Artist</p>
                <p className="font-semibold text-lg text-white">{data.name}</p>
            </div>
        </div>
    )
}

export default ArtistTrack