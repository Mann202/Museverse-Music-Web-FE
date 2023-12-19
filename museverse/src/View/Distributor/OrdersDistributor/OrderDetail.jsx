import React, { useEffect, useState } from 'react'
import Headers from '../../Header/Header'
import Loading from '../../Loading/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../API/axios';

const OrderDetail = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false);
    const { order_id } = useParams();

    const handleDelete = (orderid) => {
        // try {
        //   const response = axiosInstance.get(`/api/deleteUserOrder?order_id=${orderid}`);
        //   const path = "/orders"
        //   Swal.fire({
        //     background: "#1F1F22",
        //     color: '#EE5566',
        //     title: "Delete order successful!",
        //     icon: "success",
        //     iconColor: '#EE5566'
        //   });
        //   navigate(path)
        //   const updatedData = data.filter(row => row.order_id !== orderid);
        //   setData(updatedData);
        // } catch (error) {
        //   console.error('Error deleting album:', error);
        // }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let item = { order_id: order_id };
                console.log(order_id);
                const response = await axiosInstance("/api/getOrderDetail", {
                    method: 'POST',
                    data: item
                });

                setLoad(true);
                setData(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    if (!load) return <Loading />;


    return (
        <div>
            <Headers />
            <table className="border-collapse text-white mx-5 my-5 text-center border-[#EE5566] border ">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-[#EE5566] border-r">Album</th>
                        <th className="py-2 px-4 border-b border-[#EE5566]  border-r">Price</th>
                        <th className="py-2 px-4 border-b border-[#EE5566]  border-r">Quantity</th>
                        <th className="py-2 px-4 border-b border-[#EE5566] border-r ">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr key={item.order_id}>
                                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                                    <div className='flex gap-6 text-left'>
                                        <img src={item.url_poster} alt="picture" className='w-[147.09px] h-[120px]' />
                                        {item.description}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                                    {item.price}
                                </td>
                                <td className="py-2 px-4 border-b border-[#EE5566] border-r">
                                    {item.num}
                                </td>
                                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                                    {item.total_money}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default OrderDetail