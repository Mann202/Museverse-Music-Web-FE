import React, { useState } from 'react';
import Headers from './../../Header/Header';
import { NavLink } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import { CgSortAz } from "react-icons/cg";

function Distributor() {
    const [data, setData] = useState([
        { user: 'Man Gia', sales: '40k+ sales', revenue: '1m3 revenue', isChecked: false },
        { user: 'Binh Nguyen', sales: '100k+ sales', revenue: '2m2 revenue', isChecked: false },
        { user: 'Xuan Quynh', sales: '50k+ sales', revenue: '1m2 revenue', isChecked: false },
        { user: 'Quang Nhat', sales: '0 sales', revenue: '0 revenue', isChecked: false }
    ]);

    const [selectAll, setSelectAll] = useState(false);
    const [sortType, setSortType] = useState(null);

    const handleSelectAll = () => {
        const updatedData = data.map(item => ({ ...item, isChecked: !selectAll }));
        setData(updatedData);
        setSelectAll(!selectAll);
    };

    const handleRowCheckbox = (index) => {
        const updatedData = [...data];
        updatedData[index].isChecked = !updatedData[index].isChecked;
        setData(updatedData);

        const allSelected = updatedData.every(item => item.isChecked);
        setSelectAll(allSelected);
    };

    const sortByUser = () => {
        const sortedData = [...data].sort((a, b) => a.user.localeCompare(b.user));
        setData(sortedData);
        setSortType('user');
    };

    const sortBySales = () => {
        const sortedData = [...data].sort((a, b) => {
            const salesA = parseInt(a.sales);
            const salesB = parseInt(b.sales);
            return salesB - salesA;
        });
        setData(sortedData);
        setSortType('sales');
    };

    const sortByRevenue = () => {
        const sortedData = [...data].sort((a, b) => {
            const revenueA = parseFloat(a.revenue);
            const revenueB = parseFloat(b.revenue);
            return revenueB - revenueA;
        });
        setData(sortedData);
        setSortType('revenue');
    };

    return (
        <div>
            <Headers />
            <div className='flex justify-center pt-10'>
                <div className='w-11/12'>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row gap-5'>
                            <div className='flex items-center'>
                                <p className='text-white'>All ({data.length})</p>
                            </div>
                            <NavLink to={`/distributors/NewDistributor`} className='text-white bg-[#EE5566] rounded px-6 py-1'>Add new</NavLink>
                        </div>
                        <div className='flex flex-row gap-5'>
                            <IoIosSearch className='text-[#EE5566] text-2xl'></IoIosSearch>
                            <IoIosSettings className='text-[#EE5566] text-2xl'></IoIosSettings>
                            <CgSortAz className='text-[#EE5566] text-2xl'></CgSortAz>
                        </div>
                    </div>
                    <table className="mt-6 w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-center text-white">
                                    <input type="checkbox" className='form-checkbox h-5 w-5' checked={selectAll} onChange={handleSelectAll} />
                                </th>
                                <th className="cursor-pointer py-2 px-4 text-center text-white" onClick={sortByUser}>
                                    <div className='flex justify-center gap-4'>
                                        User
                                            <div className='flex flex-col'>
                                                <TiArrowSortedUp className='text-white text-xs'/>
                                                <TiArrowSortedDown className='text-white text-xs'/>
                                            </div>
                                    </div>
                                </th>
                                <th className="cursor-pointer py-2 px-4 text-center text-white" onClick={sortBySales}>
                                    <div className='flex justify-center gap-4'>
                                        Sale
                                            <div className='flex flex-col'>
                                                <TiArrowSortedUp className='text-white text-xs'/>
                                                <TiArrowSortedDown className='text-white text-xs'/>
                                            </div>
                                    </div>
                                </th>
                                <th className="cursor-pointer py-2 px-4 text-center text-white" onClick={sortByRevenue}>
                                    <div className='flex justify-center gap-4'>
                                        Revenue
                                            <div className='flex flex-col'>
                                                <TiArrowSortedUp className='text-white text-xs'/>
                                                <TiArrowSortedDown className='text-white text-xs'/>
                                            </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 text-center text-white">
                                        <input type="checkbox" className='form-checkbox h-5 w-5' checked={item.isChecked} onChange={() => handleRowCheckbox(index)} />
                                    </td>
                                    <td className="py-2 px-4 text-center text-white">{item.user}</td>
                                    <td className="py-2 px-4 text-center text-white">{item.sales}</td>
                                    <td className="py-2 px-4 text-center text-white">{item.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Distributor