import React from 'react'
import axios from 'axios'

import { Spotify } from './Credentials'

export default function GetToken() {
    const tokenResponse = []

    axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(Spotify.ClientID + ':' + Spotify.ClientSecret)
            },
            data: 'grant_type=client_credentials',
            method: 'POST'
        }).then(response => { tokenResponse = response.data.access_token})
    
    return tokenResponse
}
