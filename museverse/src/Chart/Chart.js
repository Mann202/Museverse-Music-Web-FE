import axios from "axios";
import { useEffect, useState } from "react";
import { Spotify } from "../API/Credentials";
import CardChart from "./CardChart";

export default function Chart() {
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
        <div className="bg-transparent flex flex-col gap-5 h-screen mt-3 pb-24 overflow-y-scroll mx-7">
            <p className="text-[#1FD662] font-semibold">Top Chart</p> 
            <div className="flex felx-row justify-between w-full h-28 w-full">
                <div className="flex flex-row gap-8 w-72">
                    <div>
                        <br></br>
                        <h3 className="text-[#939393] font-medium text-sm">
                            # Song
                        </h3>
                    </div>
                </div>
                <div>
                    <br></br>
                    <p className="text-[#939393] font-medium text-sm"># Release Date</p>
                </div>
                <div className="flex flex-row gap-5 mr-5">
                    <button className="rounded-full flex justify-center items-center w-10 h-10">
                    </button>
                    <button className="w-10 h-10 rounded-full flex justify-center items-center">
                    </button>
                </div>
            </div>
          {
            data.map(item => {
                return(
                    <CardChart img={item.images[0].url}
                        name={item.name}
                        artist={item.artists[0].name}
                        release_date={item.release_date}
                    />
                )
            })
          }
        </div>
      )
}