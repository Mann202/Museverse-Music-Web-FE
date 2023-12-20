import React, { useEffect, useState } from 'react'
import Headers from '../../Header/Header'
import { NavLink, useNavigate } from 'react-router-dom';
import Loading from '../../Loading/Loading';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import axiosInstance from '../../../API/axios';
import { AxiosError } from 'axios';

const NewOrder = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false);
    const [values, setValues] = useState([]);
    const [prices, setPrices] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectAll(false);
            setSelectedItems([]);
            setTotalPrice(0);

        } else {
            setSelectAll(true);
            setSelectedItems(data.map((item, index) => index));

            const newTotalPrice = data.reduce((total, item, index) => {
                return total + prices[index] * values[index];
            }, 0);
            setTotalPrice(newTotalPrice);
        }
    };

    const handleItemToggle = (index, itemId) => {
        setSelectedItems((prevSelectedItems) => {
            let newSelectedItems;
            if (prevSelectedItems.includes(itemId)) {
                newSelectedItems = prevSelectedItems.filter((id) => id !== itemId);
            } else {
                newSelectedItems = [...prevSelectedItems, itemId];
            }

            setSelectAll(newSelectedItems.length === data.length);

            const newTotalPrice = newSelectedItems.reduce((total, id) => {
                return total + prices[id] * values[id];
            }, 0);
            setTotalPrice(newTotalPrice);

            console.warn('item', newSelectedItems);
            return newSelectedItems;
        });
    };
    const handleCheckout = () => {
        if (selectedItems.length == 0) {
            window.alert('Choose at least 1 product');
        } else {
            sessionStorage.removeItem('order');
            const updatedData = data.map((item, index) => {
                return { ...item, num: values[index], total_money: (values[index] * prices[index]) };
            });
            const newData = updatedData.filter((item, index) => selectedItems.includes(index));
            // console.log("cart",newData);
            const orders = sessionStorage.setItem('order', JSON.stringify(newData));
            // console.log(cart);
            navigate('/orders/neworder/checkout');
        }

    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                let item = { user_id: user.user_id };
                const response = await axiosInstance("/api/getDistributorAlbum", {
                    method: 'POST',
                    data: item
                });

                setLoad(true);
                setData(response.data);
            } catch (error) {
                if (error instanceof AxiosError){
                    console.error('Error:', error.response.statusText);
                }
            }
        };

        fetchData();
    }, []);

    if (!load) return <Loading />;

    if (data) {
        data.forEach((item, index) => {
            prices.push(item.variant_price || item.min_price);
            values.push(1);
        });
    }

    return (
        <div className='relative flex flex-col h-screen overflow-y-scroll'>
            <Headers />
            <div className='text-[#EE5566] ml-5 mt-3 font-bold text-lg'>Choose Album</div>
            <div className='overflow-y-scroll'>
                <table className="border-collapse text-white mx-5 text-center">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-[#EE5566]">Item</th>
                            <th className="py-2 px-4 border-b border-[#EE5566] ">Version</th>
                            <th className="py-2 px-4 border-b border-[#EE5566] ">Price</th>
                            <th className="py-2 px-4 border-b border-[#EE5566] ">Qty</th>
                            <th className="py-2 px-4 border-b border-[#EE5566]">Subtotal</th>
                            <th className="py-2 px-4 border-b border-[#EE5566]">
                                <div className='flex gap-1 items-center'>
                                    <div onClick={toggleSelectAll} onChange={toggleSelectAll}>
                                        {selectAll ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                                    </div>
                                    Select All
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            const handleInputChange = (index, value) => {
                                const newValues = [...values];
                                const oldValue = newValues[index]; // Lưu giá trị cũ trước khi cập nhật newValues
                                newValues[index] = value;
                                setValues(newValues);

                                const newPrices = [...prices]; // Tạo một bản sao của mảng prices
                                newPrices[index] = item.variant_price || item.min_price; // Cập nhật giá trị mới vào bản sao
                                setPrices(newPrices); // Cập nhật state prices với bản sao đã thay đổi

                                const newTotal = totalPrice + (value - oldValue) * (item.variant_price || item.min_price); // Sử dụng giá trị cũ để tính toán
                                if (selectedItems.includes(index)) {
                                    setTotalPrice(newTotal);
                                }
                            };

                            const isChecked = selectedItems.includes(index);

                            return (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b border-[#EE5566]">
                                        <div className='flex gap-6 text-left'>
                                            <img src={item.url_poster} alt="picture" className='w-[147.09px] h-[120px]' />
                                            {item.description}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-[#EE5566]">{(item.variant_name == null) ? 'Normal' : item.variant_name}</td>
                                    <td className="py-2 px-4 border-b border-[#EE5566]">{prices[index]} VND</td>
                                    <td className="py-2 px-4 border-b border-[#EE5566] text-center">
                                        <div>
                                            <input
                                                className='w-[60px] h-[30px] rounded-md px-2 text-black'
                                                type="number"
                                                value={values[index]}
                                                onChange={(e) => handleInputChange(index, parseInt(e.target.value))}
                                                min={1}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-[#EE5566]">
                                        {(prices[index] * values[index])} VND
                                    </td>
                                    <td className="py-2 px-4 border-b border-[#EE5566]">
                                        <div className='w-full flex justify-center'>
                                            <div
                                                onClick={() => handleItemToggle(index, index)}
                                                onChange={() => handleItemToggle(index, index)}
                                            >
                                                {isChecked ? (
                                                    <MdCheckBox />
                                                ) : (
                                                    <MdCheckBoxOutlineBlank />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-between mt-7 items-center mb-5 bg-black'>
                <div className='flex ml-5 gap-2'>
                    <div onClick={() => { navigate(-1) }} className="w-[172px] h-9 text-[#EE5566] flex bg-opacity-0 rounded-[50px] border-2 border-[#EE5566] justify-center items-center cursor-pointer select-none hover:bg-[#262626]"
                    >
                        <div className="text-sm font-semibold">Back</div>
                    </div>
                </div>
                <div className='flex mr-5 gap-3'>
                    <div className="text-center text-white text-base font-semibold">
                        Total Payment ({data.length} items):
                        <span className="text-rose-500 text-2xl font-semibold"> {totalPrice} VND</span>
                    </div>
                    <div onClick={handleCheckout} className="w-[172px] h-9 flex bg-[#EE5566] rounded-[50px] justify-center items-center cursor-pointer select-none hover:bg-[#f17482]">
                        <div className="text-white text-sm font-semibold">Continue</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewOrder