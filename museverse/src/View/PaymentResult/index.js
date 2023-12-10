import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrder } from '../../Utils/payOS';
import Headers from '../Header/Header';
import OrderTable from './OrderTable';

export default function PaymentResult() {
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
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
          console.log(data);
          if (data.error == 0) {
            setOrder(data.data);
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
