import React from 'react';
import Headers from '../../Header/Header';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '../../../API/axios';

const schema = yup.object().shape({
  username: yup.string().min(6, 'Username must be at least 6 characters').required(),
  firstName: yup.string().matches(/^[^\d]+$/, 'First Name cannot contain numbers').required(),
  lastName: yup.string().matches(/^[^\d]+$/, 'Last Name cannot contain numbers').required(),
  email: yup.string().email('Invalid email format').required(),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Password must contain uppercase, number, and special character')
    .required(),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required(),
  phoneNumber: yup.string().matches(/^0\d{9}$/, 'Invalid phone number').required(),
  dateOfBirth: yup.date().max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Must be 18 or older').required(),
});

function NewUser() {
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    axiosInstance.post(`/api/insertUser`, {
      email: data.email,
      username: data.username,
      password: data.password,
      firstname: data.firstName,
      lastname: data.lastName
    })
  };

  return (
    <div className="h-screen overflow-y-auto text-white">
      <Headers />
      <div className="p-8">
        <p className="text-xl font-bold mb-4">User Information</p>
        <form className="flex flex-col gap-4 w-8/12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <label className="text-white mb-2">Username</label>
            <input
              {...register('username')}
              className={`text-black p-2 rounded border ${errors.username ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-white mb-2">First Name</label>
              <input
                {...register('firstName')}
                className="text-black p-2 rounded border border-gray-600"
              />
              {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-white mb-2">Last Name</label>
              <input
                {...register('lastName')}
                className="text-black p-2 rounded border border-gray-600"
              />
              {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              className={`text-black p-2 rounded border ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-2">Password</label>
            <input
              {...register('password')}
              type="password"
              className={`text-black p-2 rounded border ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-2">Confirm password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className={`text-black p-2 rounded border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-2">Phone Number</label>
            <input
              {...register('phoneNumber')}
              className={`text-black p-2 rounded border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-2">Date of Birth</label>
            <input
              {...register('dateOfBirth')}
              type="date"
              className={`text-black p-2 rounded border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="text-black mr-2" {...register('applyDistributor')} />
            <label className="text-white">Apply to become a distributor</label>
          </div>

          <button type="submit" className="bg-[#EE5566] text-white px-4 py-2 rounded mt-4">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewUser;
