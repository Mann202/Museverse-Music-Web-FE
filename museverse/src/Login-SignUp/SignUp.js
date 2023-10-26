import React, { useState } from 'react'
import { bgImage } from '../assets/bg-image.png'
import { logo_txt } from '../assets/logo_txt.png'
import UsePasswordToggle from './UsePasswordToggle';

export default function SignUp() {
    const [PasswordInputType, ToggleIcon, change] = UsePasswordToggle();
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
            validationErrors.username = "Username is required"
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
                    <h1 className='text-[#1FD662] text-5xl font-bold mb-7'>Sign Up</h1>
                    <div className='flex-col text-lg'>
                        <div className='relative text-[#FFFFFF] border-b border-white mb-6'>
                            <input
                                type="text"
                                placeholder='Username'
                                className='w-[400px] h-[35px] flex-col bg-transparent outline-none'
                                onChange={handleChange}
                            />
                        </div>
                        <div className='text-red-600'>
                            {errors.username && <span>{errors.username}</span>}
                        </div>
                        <div className='relative text-[#FFFFFF] border-b border-white mb-6'>
                            <input
                                type="email"
                                placeholder='Email address'
                                className='w-[400px] h-[35px] flex-col bg-transparent outline-none'
                                onChange={handleChange}
                            />
                        </div>
                        <div className='text-red-600'>
                            {errors.email && <span>{errors.email}</span>}
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
                        <div class="w-[400px] p-0 text-center text-white text-xl font-semibold bg-[#1FD662] rounded-lg mb-1">
                            <button type='submit' className=' w-full h-full p-2 rounded-lg'>Create Account</button >
                        </div>

                        <div className='text-xl font-medium text-white'>
                            Already have an account ?
                            <span className="text-[#1FD662] underline">Login here</span>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}