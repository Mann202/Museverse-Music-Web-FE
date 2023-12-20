import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrder } from '../../Utils/payOS';
import Headers from '../Header/Header';
import OrderTable from './OrderTable';
import axios from 'axios';
import axiosInstance from '../../API/axios';

export default function PaymentAlbum() {
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [count, setCount] = useState(0);

  let orderCode = null;
  let paramsValue = new URLSearchParams(location.search);
  if (paramsValue.size === 0) {
    orderCode = location.state?.orderCode;
  } else {
    orderCode = paramsValue.get('orderCode');
  }
  useEffect(() => {
    if (orderCode === null) {
      setLoading(false);
      return
    }

    ; (async () => {
      try {
        const data = await getOrder(orderCode)
        console.log(JSON.stringify(data, null, 2));

        if (data.error == -1) {
          alert('Không tìm thấy đơn hàng');
          setLoading(false);

          return
        }

        if (data.error == 0) {
          setOrder(data.data);

          const item = localStorage.getItem('myItem')
          console.log(item)

          const response = await axiosInstance("/api/pay", {
            method: 'POST',
            data: item
          });
          const result = response.data;

          if (result.hasOwnProperty('Error')) {
            console.log('Error', result['Error'])
          } else {
            console.log('messs', result)
            window.alert('Order successfully');
            localStorage.removeItem('myItem');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        window.alert('pay failed!');
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  return (
    <div>
      <Headers />
      <div className="overflow-y-scroll h-screen">
        <div className="flex items-center justify-center mt-20">
          <div className="w-[95%]">
            {loading ? (
              'Loading...'
            ) : (
              <div>
                <OrderTable data={order} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
