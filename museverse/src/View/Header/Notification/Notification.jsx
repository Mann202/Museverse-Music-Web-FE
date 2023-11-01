import React, {useState} from 'react'
import { NavLink } from 'react-router-dom';

function Notification({notification, data}) {
    const [focus, setFocus] = useState(false)

    const artists = data[0].artists

    var ngayThangBanDau = data[0].release_date;
    var parts = ngayThangBanDau.split('-');
    var ngay = parts[2];
    var thang = parts[1];
    var nam = parts[0];
    var ngayThangMoi = ngay + '/' + thang + '/' + nam;

    return (
        <div className="bg-[#1A1A1A] w-96 p-4 rounded-md h-fit absolute top-16 right-4 border-solid border-[1px] border-gray-700 mt-1">
            <div className="flex flex-row gap-6">
                <img src={data[0].images[0].url} className="w-24 h-24 rounded"></img>
                <div>
                    <h3 className="font-semibold text-white text-lg">{data[0].name}</h3>
                    <div className='flex flex-row'>
                        {
                            artists.map((item, index) => (
                                <NavLink to={`/artist/${item.id}`} className={`text-sm text-white text-opacity-50 font-medium hover:underline ${focus ? "text-opacity-100" : "text-opacity-50"}`} key={index}>
                                    {item.name}{index !== artists.length - 1 ? `, ` : ''} 
                                </NavLink>
                            ))
                        }
                    </div>
                    <p className="text-white font-semibold text-sm pt-1">{data[0].album_type.charAt(0).toUpperCase() + data[0].album_type.slice(1)} - {ngayThangMoi}</p>
                </div>
            </div>
            <div className='flex flex-col text-[#EE5566] items-end'>
                <NavLink to={'/newrelease/'} className='hover:underline'>Show more</NavLink>
            </div>
        </div>
    )
}
//data[0].album_type
export default Notification