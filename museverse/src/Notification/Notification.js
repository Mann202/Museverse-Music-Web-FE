import React, {useState, useEffect} from 'react'
import { Spotify } from '../API/Credentials'
import axios from 'axios'

function Notification() {
    const [token, setToken] = useState('')
    const [data,setData] = useState([])
    
    const ClientID = Spotify.ClientID
    const ClientSecret = Spotify.ClientSecret

    useEffect(() => {
        // Gọi API để lấy token
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(ClientID + ':' + ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        })
        .then(response => {
            setToken(response.data.access_token);
            // Gọi API Spotify ngay sau khi nhận được token
            axios('https://api.spotify.com/v1/browse/new-releases?country=VN', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + response.data.access_token
                }
            })
            .then(json => {
                setData(json.data.albums.items); // Lưu dữ liệu từ API vào state
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

  return (
    <div>Notification</div>
  )
}

export default Notification