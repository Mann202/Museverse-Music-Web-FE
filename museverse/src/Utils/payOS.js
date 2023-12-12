import axios from 'axios';

export async function createPaymentLink(formData) {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/api/order/create`,
      data: formData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getOrder(orderId) {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/api/getPaymentLinkInfoOfOrder/${orderId}`,
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
