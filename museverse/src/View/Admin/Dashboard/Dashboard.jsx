import React, { useEffect, useState } from 'react'
import Headers from '../../Header/Header'
import UserDashboard from './UserDashboard'
import { NavLink } from 'react-router-dom'
import DistributorDashboard from './DistributorDashboard'
import SalesDashboard from './SalesDashboard'
import axios from 'axios'

function Dashboard() {
    const [albumOrders, setAlbumOrders] = useState(0)
    const [newUser, setNewUser] = useState(0)
    const [revenue, setRevenue] = useState(0)
    const [userDashboard, setUserDashboard] = useState([])

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/getOrderReport`).then(
            response => {setAlbumOrders(response.data.length)}
        )

        axios.get(`http://127.0.0.1:8000/api/getNewUserCount`).then(
            response => {setNewUser(response.data)}
        )

        axios.get(`http://127.0.0.1:8000/api/report/overview`).then(
            response => {setRevenue(response.data?.total)}
        )

        axios.get(`http://127.0.0.1:8000/api/report/user-top`).then(
            response => {setUserDashboard(response.data)}
        )
    }, [])

  return (
    <div className='h-screen overflow-y-auto pb-24'>
        <Headers />
        <div className='w-full flex flex-row gap-4 pt-5'>
            <div className='w-7/12'>
                <div className='flex justify-center'>
                    <div className='w-11/12'>
                        <p className='text-white text-xl font-semibold'>In the last 30 days, </p>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <div className='flex flex-row gap-5 pt-7 w-11/12'>
                        <div className='bg-[#EE5566] flex flex-col gap-1 bg-opacity-60 w-4/12 py-3 pl-1'>
                            <p className='text-white text-2xl font-medium'>{albumOrders}</p>
                            <p className='text-white'>Albums sale</p>
                        </div>
                        <div className='bg-[#EE5566] flex flex-col gap-1 bg-opacity-60 w-4/12 py-3 pl-1'>
                            <p className='text-white text-2xl font-medium'>{newUser}</p>
                            <p className='text-white'>New users and distributors</p>
                        </div>
                        <div className='bg-[#EE5566] flex flex-col gap-1 bg-opacity-60 w-4/12 py-3 pl-1'>
                            <p className='text-white text-2xl font-medium'>{formatCurrency(revenue)}</p>
                            <p className='text-white'>Revenue generated</p>
                        </div>
                    </div>
                </div>

                <UserDashboard userDashboard={userDashboard}/>

                <div>
                    <div className='flex justify-end pt-4 mr-3'>
                        <NavLink to={`/users`} className='text-white bg-[#EE5566] p-2 rounded-sm'>View all user</NavLink>
                    </div>
                </div>
            </div>

            <div className='w-5/12 flex flex-col gap-y-10 pt-12'>
                <DistributorDashboard />

                <SalesDashboard />
            </div>
        </div>
    </div>
  )
}

export function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(number);
  }

export default Dashboard