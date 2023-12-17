import React from 'react'
import { formatCurrency } from './Dashboard'

function UserDashboard({userDashboard}) {
    return (
        <div>
            <div className='flex justify-center'>
                <div className='flex flex-row justify-between pt-7 w-11/12'>
                    <p className='text-white text-xl font-semibold'>All users</p>
                    <div className='flex gap-2'>
                        <input placeholder='Search'></input>
                        <button className='text-white'>Search</button>
                    </div>
                </div>
            </div>

            <div className='pt-3'>
                <table className="w-full text-white">
                    <tr>
                        <th className="py-2 px-4">User</th>
                        <th className="py-2 px-4">Status</th>
                        {/* <th className="py-2 px-4">Top Listening Artist</th> */}
                        {/* <th className="py-2 px-4">Total order</th> */}
                        <th className="py-2 px-4">Revenue</th>
                    </tr>
                    {
                        userDashboard.slice(0,8).map(item => {
                            return(
                                <tr>
                                    <td className="py-2 px-4 text-center">{item.first_name} {item.last_name}</td>
                                    <td className="py-2 px-4 text-center">{
                                        item.accountStatusId === 1 ? <div className='bg-green-200 text-black rounded-sm p-1'><p>Active</p></div>
                                        :
                                        item.accountStatusId === 2 ? <div className='bg-gray-300 text-black rounded-sm p-1'><p>Inactive</p></div>
                                        :
                                        item.accountStatusId === 3 ? <div className='bg-orange-300 text-black rounded-sm p-1'><p>Closed</p></div>
                                        : <div className='bg-red-300 text-black rounded-sm p-1'><p>Banned</p></div>
                                    }</td>
                                    {/* <td className="py-2 px-4 text-center">The Weekend</td> */}
                                    {/* <td className="py-2 px-4 text-center">{item.name_count}</td> */}
                                    <td className="py-2 px-4 text-center">{formatCurrency(item.spend)}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default UserDashboard