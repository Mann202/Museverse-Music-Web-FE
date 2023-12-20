import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrder } from '../../Utils/payOS';
import Headers from '../Header/Header';
import OrderTable from './OrderTable';
import axios from 'axios';

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
    if (orderCode !== null) {
      getOrder(orderCode)
        .then((data) => {
          console.log(JSON.stringify(data, null, 2));
          if (data.error == 0) {
            setOrder(data.data);
            const fetchData = async () => {
              try {
                const item = JSON.parse(localStorage.getItem('myItem'));
                const response = await fetch("http://localhost:8000/api/pay", {
                  method: 'POST',
                  body: JSON.stringify(item),
                  headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                  }
                });

                if (response.ok) {
                  const result = await response.json();
                  if (result.hasOwnProperty('Error')) {
                    console.log('Error', result['Error'])
                  } else {
                    console.log('messs', result)
                    // window.alert('Order successfully!');  
                    setCount(1);
                    localStorage.removeItem('myItem')
                  }
                } else {
                  console.error('Error:', response.statusText);
                  window.alert('Pay failed!');

                }
              } catch (error) {
                window.alert('Error:', error);
              }
            };
            fetchData();
          } else if (data.error == -1) {
            alert('Không tìm thấy đơn hàng');
          }
          setLoading(false);
        })
        .catch((error) => {
          alert('Có lỗi xảy ra');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

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
