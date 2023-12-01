import React from 'react'
import { NavLink } from 'react-router-dom'

function SalesDashboard() {
    return (
        <div className='flex justify-center'>
            <div className='bg-[#EE5566] w-11/12 pb-3 rounded'>
                <p className='text-white text-center pt-3 font-medium'>Best-selling products</p>
                <div className='flex flex-row justify-center'>
                    <table className="mt-4">
                        <tr>
                            <td className="py-2 px-4 text-center text-white">Man Gia</td>
                            <td className="py-2 px-4 text-center text-white">40k+ sales</td>
                            <td className="py-2 px-4 text-center text-white">1m2 revenue</td>
                        </tr>
                    </table>
                </div>
            <div className='flex justify-center pt-4 mr-3'>
                    <NavLink to={`/report`} className='text-[#EE5566] bg-white py-1 px-2 rounded-sm'>View report</NavLink>
                </div>
            </div>
        </div>
    )
}

export default SalesDashboard