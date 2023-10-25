import React, {useEffect, useState} from 'react'
import axios from 'axios';

import { Spotify } from '../API/Credentials';

function RelatedArtist({id}) {
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(6)
    const [type, setType] = useState("single")
    const [disable, setDisable] = useState(false)

    useEffect(() => {
        // Gọi API để lấy token
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
        .then(response => {
            setToken(response.data.access_token);
            
            // Gọi API Spotify ngay sau khi nhận được token
            axios(`https://open.spotify.com/artist/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                console.log(json)
                setData(json.data.items);
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [setToken, setData]);

  return (
    <div>RelatedArtist</div>
  )
}

export default RelatedArtist