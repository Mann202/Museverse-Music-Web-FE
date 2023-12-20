import React, { useEffect, useState } from 'react'
import Headers from '../../Header/Header'
import Loading from '../../Loading/Loading';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import axiosInstance from '../../../API/axios';

function OrdersDistributor() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const handleDelete = async (orderid) => {
    const fetchData = async () => {
      try {
        let item = { order_id: orderid };
        await axiosInstance(`/api/deleteUserOrder`, {
          method: 'POST',
          data: item
        });

        Swal.fire({
          background: "#1F1F22",
          color: '#EE5566',
          title: "Delete order successful!",
          icon: "success",
          iconColor: '#EE5566'
        });
        const path = "/orders";
        navigate(path);
        const updatedData = data.filter(row => row.order_id !== orderid);
        setData(updatedData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let item = { user_id: user.user_id };
        const response = await axiosInstance("/api/getUserOrder", {
          method: 'POST',
          data: item
        });

        const result = response.data
        setLoad(true);
        setData(result);
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
      <div className='text-[#EE5566] ml-5 mt-3 font-bold text-lg'>Album Orders</div>
      <div className='ml-5 mt-3'>
        <button className="bg-[#EE5566] text-white py-1 px-2 rounded" onClick={() => { navigate('/orders/neworder') }}>
          Add new order
        </button>
      </div>
      <table className="border-collapse text-white mx-5 my-5 text-center border-[#EE5566] border ">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-[#EE5566] border-r">Customer Name</th>
            <th className="py-2 px-4 border-b border-[#EE5566]  border-r">Customer Email</th>
            <th className="py-2 px-4 border-b border-[#EE5566]  border-r">Customer PhoneNumber</th>
            <th className="py-2 px-4 border-b border-[#EE5566] border-r ">Customer Address</th>
            <th className="py-2 px-4 border-b border-[#EE5566]  border-r">Note</th>
            <th className="py-2 px-4 border-b border-[#EE5566]  border-r">Order Date</th>
            <th className="py-2 px-4 border-b border-[#EE5566]  border-r">Album Quantity</th>
            <th className="py-2 px-4 border-b border-[#EE5566]  border-r">Total</th>
            <th className="py-2 px-4 border-b border-[#EE5566]  border-r"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={item.order_id}>
                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                  {item.cust_name}
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                  {item.cust_email}
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566] border-r">
                  {item.cust_contact_number}
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                  {item.cust_address}
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                  {item.note}
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                  {item.created_at}
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                  {item.album_quantity}
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                  {item.total_final}
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]  border-r">
                  <div className='flex flex-col gap-3'>
                    <button className="bg-[#EE5566] text-white py-1 px-2 rounded" onClick={() => { navigate(`/orderdetail/${item.order_id}`) }}>
                      Detail
                    </button>
                    <button className="bg-red-700 text-white py-1 px-2 rounded" onClick={() => handleDelete(item.order_id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

  )
}

export default OrdersDistributor