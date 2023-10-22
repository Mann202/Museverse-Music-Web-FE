import React, {useState, useEffect} from 'react'
import { Spotify } from '../API/Credentials'
import axios from 'axios'

function Notification({notification, data}) {
    const [token, setToken] = useState('')

    var ngayThangBanDau = data[0].release_date;
    var parts = ngayThangBanDau.split('-');
    var ngay = parts[2];
    var thang = parts[1];
    var nam = parts[0];
    var ngayThangMoi = ngay + '/' + thang + '/' + nam;

    return (
        <div className="bg-[#1A1A1A] w-96 p-4 rounded-md h-32 absolute top-16 right-4 border-solid border-[1px] border-gray-700">
            <div className="flex flex-row gap-6">
                <img src={data[0].images[0].url} className="w-24 h-24 rounded"></img>
                <div>
                    <h3 className="font-semibold text-white text-base">{data[0].name}</h3>
                    <p className="text-[#939393] text-sm pt-1">{(data[0].artists[0].name.length > 50 && data[0].name > 50) ? data[0].artists[0].name.slice(50) + "..." : data[0].artists[0].name}</p>
                    <p className="text-white font-semibold text-sm pt-1">{data[0].album_type.charAt(0).toUpperCase() + data[0].album_type.slice(1)} - {ngayThangMoi}</p>
                </div>
            </div>
        </div>
    )
}
//data[0].album_type
export default Notification