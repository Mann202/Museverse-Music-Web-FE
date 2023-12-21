import React, { useEffect, useState } from 'react'
import Headers from '../Header/Header'
import { MdOutlineNavigateNext } from 'react-icons/md'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import Loading from '../Loading/Loading'
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import axiosInstance from '../../API/axios'

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [load, setLoad] = useState(false);
  const [values, setValues] = useState([]);
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
      setSelectedItems(data.map((item) => item.detail_id));
      const newTotalPrice = data.reduce((total, item, index) => {
        return total + item.price * values[index];
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

      // Cập nhật tổng giá trị
      const newTotalPrice = newSelectedItems.reduce((total, id) => {
        const selectedItem = data.find((item) => item.detail_id === id);
        const idex = data.indexOf(selectedItem);
        return total + selectedItem.price * values[idex];
      }, 0);
      setTotalPrice(newTotalPrice);

      return newSelectedItems;
    });
  };
  const handleDelete = () => {
    const newData = data.filter((item) => !selectedItems.includes(item.detail_id));
    setData(newData);

    // Cập nhật lại giá trị tổng
    const newTotalPrice = newData.reduce((total, item) => {
      if (selectedItems.length == 0) return 0;
      const index = data.findIndex((dataItem) => dataItem.detail_id === item.detail_id);
      return total + item.price * values[index];
    }, 0);
    setSelectedItems([])
    setTotalPrice(newTotalPrice);

    //xóa trong database
    const deleteData = async () => {
      // setLoad(false);
      try {
        // let item[] = {  };
        const response = await axiosInstance("/api/deleteCart", {
          method: 'POST',
          data: { arr: selectedItems }
        });

        const result = response.data
        if (result > 0)
          console.log('xoa nhieu dong');
        else
          console.log('ko xoa dong nao');
      } catch (error) {
        console.error('Error:', error);
      }
    };

    deleteData();
  };
  const handleCheckout = () => {
    if (selectedItems.length == 0) {
      window.alert('Choose at least 1 product');
    } else {
      sessionStorage.removeItem('cart');

      data.map((item, index) => {
        item.num = values[index];
        item.total_money = values[index] * item.price;

      })
      const newData = data.filter((item) => selectedItems.includes(item.detail_id));
      // console.log("cart",newData);
      const cart = sessionStorage.setItem('cart', JSON.stringify(newData));
      console.log(cart);
      navigate('/shoppingcart/checkout');
    }

  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let item = { cust_id: user.user_id };
        const response = await axiosInstance("/api/loadCart", {
          method: 'POST',
          data: item
        });


        const result = response.data
        if (result.hasOwnProperty('Error')) {
          setData([]);
        } else {
          setData(result);
        }

        setLoad(true);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (data) {
      setValues(data.map((item) => item.num));
    }
  }, [data]);

  if (!load) return <Loading />;

  return (
    <div className='h-screen overflow-y-scroll pb-20'>
      <Headers />
      <div className='flex justify-between w-full h-[10%] mt-3 items-center'>
        <div className='text-[#EE5566] ml-5 flex items-center'>
          <NavLink to={'/albums'} className='hover:underline'>Albums</NavLink>
          <MdOutlineNavigateNext className='mt-1 text-white text-lg' />
          <div className='text-white'>Shopping Cart</div>
        </div>
        <div className='mr-4 '>
          <div className="flex gap-2 ml-4">
            <button onClick={() => { navigate('/shoppingcart') }} className={`text-[#EE5566] bg-[#131313] hover:bg-[#262626] rounded-full h-10 w-10 flex justify-center items-center hover:text-lg active:bg-[#EE5566] active:text-white`}>
              <FaShoppingCart className='text-xl font-semibold' />
            </button>
          </div>

        </div>
      </div>
      <table className="border-collapse text-white mx-5 text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-[#EE5566] w-[55%]">Item</th>
            <th className="py-2 px-4 border-b border-[#EE5566] w-[13%] ">Price</th>
            <th className="py-2 px-4 border-b border-[#EE5566] w-[5%] ">Qty</th>
            <th className="py-2 px-4 border-b border-[#EE5566] w-[15%]">Subtotal</th>
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
              const newTotal = totalPrice + (value - oldValue) * item.price; // Sử dụng giá trị cũ để tính toán
              if (selectedItems.includes(item.detail_id)) {
                setTotalPrice(newTotal);
              }
            };

            const isChecked = selectedItems.includes(item.detail_id);

            return (
              <tr key={item.detail_id}>
                <td className="py-2 px-4 border-b border-[#EE5566]">
                  <div className='flex gap-6 text-left'>
                    <img src={item.url_poster} alt="picture" className='w-[147.09px] h-[120px]' />
                    {item.description}
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]">{item.price} VND</td>
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
                  {item.price * values[index]} VND
                </td>
                <td className="py-2 px-4 border-b border-[#EE5566]">
                  <div className='w-full flex justify-center'>
                    <div
                      onClick={() => handleItemToggle(index, item.detail_id)}
                      onChange={() => handleItemToggle(index, item.detail_id)}
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
      <div className='flex justify-between mt-7 items-center mb-5'>
        <div className='flex ml-5 gap-2'>
          <NavLink to={'/albums'} className="w-[172px] h-9 text-[#EE5566] flex bg-opacity-0 rounded-[50px] border-2 border-[#EE5566] justify-center items-center cursor-pointer select-none hover:bg-[#262626]"
          >
            <div className="text-sm font-semibold">Continue Shopping</div>
          </NavLink>
          <div class="w-[172px] h-9 text-[#EE5566] flex bg-opacity-0 rounded-[50px] border-2 border-[#EE5566] justify-center items-center cursor-pointer select-none hover:bg-[#262626]"
            onClick={handleDelete}>
            <div class="text-sm font-semibold">Delete</div>
          </div>
        </div>
        <div className='flex mr-5 gap-3'>
          <div className="text-center text-white text-base font-semibold">
            Total Payment ({data.length} items):
            <span className="text-rose-500 text-2xl font-semibold"> {totalPrice} VND</span>
          </div>
          <div onClick={handleCheckout} className="w-[172px] h-9 flex bg-[#EE5566] rounded-[50px] justify-center items-center cursor-pointer select-none hover:bg-[#f17482]">
            <div className="text-white text-sm font-semibold">Checkout</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart