import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { Spotify } from '../../API/Credentials';
import RelatedArtistCard from './RelatedArtistCard';
import { LoggedContext } from "../Login-SignUp/LoggedContext";

function RelatedArtist({id}) {
    const [token, setToken] = useState('');
    const { logged, setLogged } = useContext(LoggedContext);
    const [data, setData] = useState([]);
    const [artistID, setArtistID] = useState('')
    const [dataSlice, setDataSlice] = useState(0);
    

    useEffect(() => {
        if(logged) {
            setDataSlice(5)
        } else {
            setDataSlice(6)
        }
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
            const token = response.data.access_token;
            // Gọi Spotify Web API để lấy thông tin về nghệ sĩ
            axios(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data.artists)
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }, [id]);

  return (
    <div className='mt-10'>
        <div className="flex flex-row gap-5 justify-between">
            <h3 className="text-[#EE5566] text-lg text-opacity-80 font-semibold font-base ml-7">Related artists</h3>
            <div className="flex flex-row items-end mr-7">
                <NavLink to={`/artist/${id}/related-artists`} className="text-[#EE5566] text-opacity-80 hover:underline">Show all</NavLink>
            </div>
        </div>
        <div className='flex justify-center mt-2'>
            <div className="flex flex-row flex-wrap justify-between gap-5 w-[94%]" >
                {
                    data.slice(0,dataSlice).map((item) => (
                        <RelatedArtistCard 
                        id={item.id}
                        image={item.images[0].url}
                        name={item.name}
                        />
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default RelatedArtist