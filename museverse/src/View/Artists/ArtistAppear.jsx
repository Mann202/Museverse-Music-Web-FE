import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { Spotify } from '../../API/Credentials';
import AppearOnCard from './AppearOnCard';
import { LoggedContext } from "../Login-SignUp/LoggedContext";

function ArtistAppear({id, dark}) {
    const [data, setData] = useState([])
    const { logged, setLogged } = useContext(LoggedContext);
    const [limit, setLimit] = useState(5)

    useEffect(() => {
        if(logged) {
            setLimit(5)
        } else {
            setLimit(6)
        }
    }, [])

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
            const token = response.data.access_token;
            // Gọi Spotify Web API để lấy thông tin về nghệ sĩ
            axios(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=appears_on&market=VN&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                setData(response.data.items)
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
        <div className='mt-7'>
            <div className="flex flex-row gap-5 justify-between">
                <h3 className="text-[#EE5566] text-lg text-opacity-80 font-semibold font-base ml-7">Appear on</h3>
                <div className="flex flex-row items-end mr-7">
                    <NavLink to={`/artist/${id}/appear-on`} className={`text-[#EE5566] text-opacity-80 ${(data.length < 6) ? "hidden" : ""} hover:underline`}>Show all</NavLink>
                </div>
            </div>
            <div className='flex justify-center'>
                <div className={`flex flex-row flex-wrap gap-5 w-[95%] ${(data.length < 6) ? "justify-start ml-5" : "justify-center"} mt-4`}>
                    {
                        data.map(item => (
                            <AppearOnCard 
                            id={item.id}
                            name={item.name}
                            image={item.images[0].url}
                            type={item.type}
                            release={item.release_date}
                            dark={dark}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ArtistAppear