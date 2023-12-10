import axios from 'axios';

export async function createPaymentLink(formData) {
  try {
    const res = await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BACKEND_URL}/order/create`,
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
      method: 'GET',
      url: `${process.env.REACT_APP_BACKEND_URL}/order/${orderId}`,
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
