import axios from 'axios';
import axiosInstance from '../API/axios';

export async function createPaymentLink(formData) {
  try {
    const res = await axiosInstance(`/api/order/create`,({
      method: 'POST',
      data: formData,
    }));
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getOrder(orderId) {
  try {
    const res = await axiosInstance(`/api/getPaymentLinkInfoOfOrder/${orderId}`, {
      method: 'POST',
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
