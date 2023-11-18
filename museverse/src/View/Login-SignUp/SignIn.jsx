import React, { useState } from 'react';
import  bgImage from '../../assets/bg-image.png'
import  logo_txt  from '../../assets/logo_txt.png'
import UsePasswordToggle from './UsePasswordToggle';
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa6";
import { useGoogleLogin } from '@react-oauth/google';

const SignIn = () => {
    const [PasswordInputType, ToggleIcon, change] = UsePasswordToggle();
    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
        // confirmPassword: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const validationErrors = {}
        if (!formData.username.trim()) {
            validationErrors.username = "Email or username is required"
        }

        if (!formData.email.trim()) {
            validationErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = "Email is not valid"
        }

        if (!formData.password.trim()) {
            validationErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            validationErrors.password = "Password should be at least 6 char"
        }

        // if (formData.confirmPassword !== formData.password) {
        //     validationErrors.confirmPassword = "password not matched"
        // }

        setErrors(validationErrors)

        if (Object.keys(validationErrors).length === 0) {
            alert("Form Submitted successfully")
        }

    }

    return (
        <div className="w-full h-screen flex items-start">
            <div className='relative w-[40%] h-full flex flex-col'>
                <div className='absolute top-[25%] left-[15%] flex flex-col'>
                    <img src={logo_txt} alt='' />
                </div>
                <img className='h-full object-cover' src={bgImage} alt='' />
            </div>

            <div className='flex flex-col p-10 w-[60%] h-full bg-[#1F1F22] items-center font-mont justify-center'>
                <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                    <h1 className='text-[#EE5566] text-5xl font-bold mb-20'>Log in to Museverse</h1>
                    <div className='w-[300px] h-[35px] relative mb-2 text-lg text-white mb-5'>
                        <input
                            type='button'
                            onClick={() => login()}
                            value='Sign in with Facebook'
                            className='w-full h-full rounded-lg bg-[#1877F2]'
                        />
                        <span className='absolute top-[20%] left-[10%] text-2xl'>
                            <FaFacebook />
                        </span>
                    </div>
                    <div className='w-[300px] h-[35px] relative mb-2 text-lg'>
                        <input
                            type='button'
                            onClick={() => login()}
                            value='Sign in with Google'
                            className='w-full h-full rounded-lg bg-white'
                        />
                        <span className='absolute top-[20%] left-[10%] text-2xl'>
                            <FcGoogle />
                        </span>
                    </div>
                    <hr className='bg-[#63676F] w-[130%] h-[1px] border-none rounded-md my-12' />
                    <div className='flex-col text-lg'>
                        <div className='relative text-[#FFFFFF] border-b border-white mb-6 '>
                            <input
                                type="text"
                                placeholder='Email or username'
                                className='w-[400px] h-[35px] flex-col bg-transparent outline-none'
                                onChange={handleChange}
                            />
                        </div>
                        <div className='text-red-600'>
                            {errors.username && <span>{errors.username}</span>}
                        </div>
                        <div className='relative text-[#FFFFFF] border-b border-white mb-6'>
                            <input
                                type={PasswordInputType}
                                placeholder='Password'
                                id='pass'
                                className='w-[400px] h-[35px] flex-col bg-transparent outline-none'
                                onChange={handleChange}
                            />
                            <span className='absolute top-[25%] right-[2%]' onClick={change}>
                                <ToggleIcon />
                            </span>
                        </div>
                        <div className='text-red-600'>
                            {errors.password && <span>{errors.password}</span>}
                        </div>
                        <div class="w-[400px] p-0 text-center text-white text-xl font-semibold bg-[#EE5566] rounded-lg mb-1">
                            <button type='submit' className=' w-full h-full p-2 rounded-lg'>Log in</button >
                        </div>

                        <div className='text-xl font-medium text-white underline'>
                            Forgot your password?
                        </div>
                    </div>
                </form>


                <div className='text-xl font-medium text-white mt-14'>
                    Don't have an account?
                    <span className="text-[#EE5566] underline">Sign up now</span>
                </div>
            </div>
        </div>
    )
}

export default SignIn