import React from 'react'

function UserDashboard() {
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
                        <th className="py-2 px-4">Top Listening Artist</th>
                        <th className="py-2 px-4">Total order</th>
                        <th className="py-2 px-4">Revenue</th>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 text-center">Man Gia</td>
                        <td className="py-2 px-4 text-center">Active</td>
                        <td className="py-2 px-4 text-center">The Weekend</td>
                        <td className="py-2 px-4 text-center">500</td>
                        <td className="py-2 px-4 text-center">400,000</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default UserDashboard