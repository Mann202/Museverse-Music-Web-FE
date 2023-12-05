import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { formatNumber } from './SalesDashboard'

function DistributorDashboard() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/getDistributorReport`).then(response => {
            setData(response.data)
        })
    }, [])

  return (
    <div className='flex justify-center'>
        <div className='bg-[#EE5566] w-11/12 pb-3 rounded'>
            <p className='text-white text-center pt-3 font-medium'>Best-selling distributors</p>
            <div className='flex flex-row justify-center'>
                <table className="mt-4">
                    {data.map(item => {
                        return(
                            <tr>
                                <td className="py-2 px-4 text-center text-white">{item.last_name} {item.first_name}</td>
                                <td className="py-2 px-4 text-center text-white">{item.number} sales</td>
                                <td className="py-2 px-4 text-center text-white">{formatNumber(item.revenue)} revenue</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
           <div className='flex justify-center pt-4 mr-3'>
                <NavLink to={`/distributors`} className='text-[#EE5566] bg-white py-1 px-2 rounded-sm'>View all distributor</NavLink>
            </div>
        </div>
    </div>
  )
}

export default DistributorDashboard