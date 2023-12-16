import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Headers from '../../Header/Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const schema = yup.object().shape({
    album_name: yup.string().min(15, 'Album name must be at least 15 characters').required('Album name is required'),
    type: yup.string().oneOf(['Băng Cassette', 'Đĩa CD', 'Đĩa Than']).required('Type is required'),
    quantity: yup.number().positive('Quantity must be greater than 0').required('Quantity is required'),
    min_price: yup.number().positive('Min price must be greater than 0').required('Min price is required'),
    max_price: yup.number()
      .positive('Max price must be greater than 0')
      .min(yup.ref('min_price'), 'Max price must be greater than or equal to Min price')
      .required('Max price is required'),
    description: yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
    url_poster: yup.string().min(10, 'URL poster must be at least 10 characters').required('URL poster is required'),
  });

const NewProduct = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  let userID = 0
    const user = localStorage.getItem('user')
    if(user != null) {
    const userJson = JSON.parse(user);
    console.log(userJson.user_id)
    userID = userJson.user_id;
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/insertNewAlbum`, {
        album_name: data.album_name,
        type: data.type,
        user_id: userID,
        min_price: data.min_price,
        max_price: data.max_price,
        description: data.description,
        url_poster: data.url_poster,
        quantity: data.quantity
      });

      if (response.status === 200) {
        Swal.fire({
            background: "#1F1F22",
            color: '#EE5566',
            title: "Add new product successful!",
            icon: "success",
            iconColor: '#EE5566'
          });
          navigate('/');
        setSuccessMessage('Add new product successful!'); 
        setErrorMessage(''); 
      } else {
        setErrorMessage('Add new product failed. Please try again.'); 
        setSuccessMessage(''); 
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setErrorMessage('Add new product failed. Please try again.'); 
      setSuccessMessage(''); 
    }
  };

  return (
    <div>
        <Headers />
        <div>
            {/* <div className='w-4/12 pt-5 pl-8'>
                {successMessage && (
                <div className="bg-green-200 text-green-800 p-2 mb-2 rounded">
                    {successMessage}
                </div>
                )}
                {errorMessage && (
                <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                    {errorMessage}
                </div>
                )}
            </div> */}
        <form onSubmit={handleSubmit(onSubmit)} className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-[#EE5566] text-sm font-bold mb-2">Album Name</label>
                    <Controller
                        name="album_name"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <input {...field} type="text" className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
                                <p className="text-red-500 text-xs italic">{errors.album_name?.message}</p>
                            </div>
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-[#EE5566] text-sm font-bold mb-2">Type</label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <select {...field} className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                    <option value="Băng Cassette">Băng Cassette</option>
                                    <option value="Đĩa CD">Đĩa CD</option>
                                    <option value="Đĩa Than">Đĩa Than</option>
                                </select>
                                <p className="text-red-500 text-xs italic">{errors.type?.message}</p>
                            </div>
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-[#EE5566] text-sm font-bold mb-2">Quantity</label>
                    <Controller
                        name="quantity"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <input {...field} type="number" className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
                                <p className="text-red-500 text-xs italic">{errors.quantity?.message}</p>
                            </div>
                        )}
                    />
                </div>

                <div className="mb-4 flex flex-row items-center justify-center">
                    <div className="mr-4 w-full">
                        <label className="block text-[#EE5566] text-sm font-bold mb-2">Min Price</label>
                        <Controller
                            name="min_price"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <input {...field} type="number" className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
                                    <p className="text-red-500 text-xs italic">{errors.min_price?.message}</p>
                                </div>
                            )}
                        />
                    </div>
                    <div className='w-full'>
                        <label className="block text-[#EE5566] text-sm font-bold mb-2">Max Price</label>
                        <Controller
                            name="max_price"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <input {...field} type="number" className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
                                    <p className="text-red-500 text-xs italic">{errors.max_price?.message}</p>
                                </div>
                            )}
                        />
                    </div>
                </div>


                <div className="mb-4">
                    <label className="block text-[#EE5566] text-sm font-bold mb-2">URL Poster</label>
                    <Controller
                        name="url_poster"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <input {...field} type="text" className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
                                <p className="text-red-500 text-xs italic">{errors.url_poster?.message}</p>
                            </div>
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-[#EE5566] text-sm font-bold mb-2">Description</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <textarea  {...field} type="text" className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
                                <p className="text-red-500 text-xs italic">{errors.description?.message}</p>
                            </div>
                        )}
                    />
                </div>
                <div className="mb-4">
                    <button className="bg-[#EE5566] text-white py-2 px-4 rounded" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default NewProduct;
