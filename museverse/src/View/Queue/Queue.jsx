import React, { useEffect, useState } from 'react';
import Headers from '../Header/Header';
import { spotifyApi } from 'react-spotify-web-playback';
import Cookies from 'js-cookie';
import axios from 'axios'; 
import { Spotify } from '../../API/Credentials';

function Queue({ queueID }) {
    const [data, setData] = useState([]);

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
            const promises = queueID.map(trackID => {
                return axios(`https://api.spotify.com/v1/tracks/${trackID}?market=VN`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
            });

            Promise.all(promises)
                .then(responses => {
                    const trackData = responses.map(response => response.data);
                    setData(trackData);
                })
        })
    }, [queueID]);

    console.log(data)

    return (
        <div>
            <Headers />
            <div>
                {/* Hiển thị dữ liệu */}
                {data.map((track, index) => (
                    <div key={index}>
                        {/* Hiển thị thông tin về từng track ở đây */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Queue;
