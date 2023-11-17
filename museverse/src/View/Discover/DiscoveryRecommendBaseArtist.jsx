import axios from 'axios';
import React, { useEffect } from 'react'
import { Spotify } from '../../API/Credentials';

function DiscoveryRecommendBaseArtist() {
    const TrackRecommendation = [];
    useEffect(() => {
        const id = 1; 
        const followArtist = []; 
    
        axios.get(`http://127.0.0.1:8000/api/followArtist?id=${id}`)
            .then(response => {
                response.data.forEach(item => {
                    followArtist.push(item.artirst_id);
                });
    
                console.log(followArtist);
    
                axios('https://accounts.spotify.com/api/token', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
                    },
                    data: 'grant_type=client_credentials',
                    method: 'POST'
                }).then(response => {
                    axios(`https://api.spotify.com/v1/recommendations?limit=5&market=VN&seed_artists=7yquVKfxBuNFJbG9cy2R8A`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + response.data.access_token
                        }
                    })
                    .then(json => {
                        console.log(json.data);
                    })
                    .catch(error => {
                        console.error('Lỗi khi gửi yêu cầu tới Spotify API:', error);
                    });
                })
                .catch(error => {
                    console.error('Lỗi khi lấy token từ Spotify:', error);
                });
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu tới API followArtist:', error);
            });
    }, []);
  return (
    <div>DiscoveryRecommendBaseArtist</div>
  )
}

export default DiscoveryRecommendBaseArtist