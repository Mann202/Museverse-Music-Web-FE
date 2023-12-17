import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { createPaymentLink } from '../../../Utils/payOS';
import { LoggedContext } from '../../Login-SignUp/LoggedContext';

const HOST = process.env.NODE_ENV === 'development' ? `http://${window.location.host}` : process.env.WEB_URL
const RETURN_URL = `${HOST}/payment/result/`;
const CANCEL_URL = `${HOST}/payment/result/`;

  let accType = 0
  const user = localStorage.getItem('user')
  if(user != null) {
    const userJson = JSON.parse(user);
    accType = userJson.accountTypeID;
  }

function DropdownMenu() {
  const { logged, setLogged } = useContext(LoggedContext);

  const handleLogOut = () => {
    setLogged(false);
    localStorage.clear();
  };

  const redirectPaymentLink = async function (checkoutResponse) {
    /**
     * Lam` theo sample React cua payOS, đoạn này có vẻ họ mới update domain nên vậy
     * Ref: https://github.com/payOSHQ/payos-demo-reactJS/blob/69bb183f399515efad8037e670396d3b360779db/src/pages/DemoPayOS.jsx#L77
     * */
    if (checkoutResponse) {
      let url = checkoutResponse.checkoutUrl;
      if (checkoutResponse.checkoutUrl.startsWith("https://dev.pay.payos.vn")) {
        url = checkoutResponse.checkoutUrl.replace(
          "https://dev.pay.payos.vn",
          "https://next.dev.pay.payos.vn"
        );
      }
      if (checkoutResponse.checkoutUrl.startsWith("https://pay.payos.vn")) {
        url = checkoutResponse.checkoutUrl.replace(
          "https://pay.payos.vn",
          "https://next.pay.payos.vn"
        );
      }

      window.location.href = url;
    }
  };


  const handleUpgradePremium = async () => {
    const user = localStorage.getItem('user')
    console.log(user)
    let email_address = ''
    let first_name = ''
    let last_name = ''
    let phone = ''
    
    if(user != null) {
      const userJson = JSON.parse(user);
      email_address = userJson.email_address;
      first_name = userJson.first_name
      last_name = userJson.last_name
      phone = userJson.contact_number
    }

    const body = {
      orderCode: '123',
      amount: 2000,
      description: 'Thanh toan premium',
      buyerName: 'Vo Hoang Duc Khoa',
      buyerEmail: '19520646@gm.uit.edu.vn',
      buyerPhone: '0707957746',
      buyerAddress: 'UIT',
      items: [
        {
          name: 'Premium',
          quantity: 1,
          price: 100000
        }
      ],
      cancelUrl: CANCEL_URL,
      returnUrl: RETURN_URL,
    }
    let response = await createPaymentLink(body);
    if (response.error != 0) throw new Error("Call Api failed: ");

    redirectPaymentLink(response.data)
  }

  return (
    <div className="absolute right-20 flex flex-col text-[#FFFFFF] bg-black bg-opacity-80 w-48 py-5 px-3 mt-1 text-lg gap-4 rounded">
      <NavLink to="/profile">Profile</NavLink>
      {
        accType == 1 ? 
        <NavLink onClick={handleUpgradePremium}>Upgrade to Premium</NavLink>
        : 
        ""
      }
      <NavLink onClick={handleLogOut} to={"/signin"}>Logout</NavLink>
    </div>
  );
}

export default DropdownMenu;