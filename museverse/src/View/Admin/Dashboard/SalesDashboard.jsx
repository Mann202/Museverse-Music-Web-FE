import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

function SalesDashboard() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/getSaleReport`).then(response => {
            setData(response.data)
        })
    },[])

    return (
        <div className='flex justify-center'>
            <div className='bg-[#EE5566] w-11/12 pb-3 rounded'>
                <p className='text-white text-xl text-center pt-3 font-semibold'>Best-selling products</p>
                <div className='flex flex-row justify-center'>
                    <table className="mt-4 ml-2 -mr-3">
                        {
                            data.map(item=>{
                                return(
                                    <tr>
                                        <td><img className='rounded-full h-12 w-16' src={item.url_poster}></img></td>
                                        <td className="py-2 px-4 text-center text-white text-base">{item.album_name}</td>
                                        <td className="py-2 px-4 text-center text-white">{item.number} {item.number > 1 ? "sales" : "sale"}</td>
                                        <td className="py-2 px-4 text-center text-white">{formatNumber(item.revenue)} revenue</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
            <div className='flex justify-center pt-4 mr-3'>
                    <NavLink to={`/report`} className='text-[#EE5566] bg-white py-1 px-2 rounded-sm'>View report</NavLink>
                </div>
            </div>
        </div>
    )
}

export function formatNumber(number) {
    if (number < 1000) {
      return number.toString();
    }
    if (number < 1000000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    if (number < 1000000000) {
      return (number / 1000000).toFixed(1) + 'M';
    }
    return (number / 1000000000).toFixed(1) + 'B';
  }

export default SalesDashboard