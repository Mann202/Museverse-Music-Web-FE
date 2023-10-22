import React, { useState } from 'react';
import './SignIn.css';
import { bgImage, logoText } from '../../assets';
import usePasswordToggle from '../SignUp/usePasswordToggle';
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa6";
import { useGoogleLogin } from '@react-oauth/google';
import {Link} from 'react-dom'
import SignUp from '../SignUp/SignUp'

const SignIn = () => {
    const [PasswordInputType, ToggleIcon, change] = usePasswordToggle();
    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });
    const [formData, setFormData] = useState({
        // username: '',
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
        // if (!formData.username.trim()) {
        //     validationErrors.username = "username is required"
        // }

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
        <div>
            <section className='left-section'>
                <img src={logoText} alt="" className='logo' />
            </section>
            <section className='right-section'>
                <form onSubmit={handleSubmit}>
                    <p className='login'>Log in to Museverse</p>
                    <div className='btn01'>
                        <input
                            type='button'
                            onClick={() => login()}
                            value='Sign in with Google'
                            className='sign-gg-btn'
                        />
                        <span className='sign-gg-icon'>
                            <FcGoogle />
                        </span>
                    </div>
                    <div className='btn01'>
                        <input
                            type='button'
                            onClick={() => login()}
                            value='Sign in with Facebook'
                            className='sign-fb-btn'
                        />
                        <span className='sign-fb-icon'>
                            <FaFacebook />
                        </span>
                    </div>

                    <hr className='line' />

                    <div className='form-01'>
                        <div>
                            <input
                                type="text"
                                placeholder='Email or username'
                                name='email'
                                className='content'
                                onChange={handleChange}
                            />
                        </div>
                        <div className='error-mess'>
                            {errors.email && <span>{errors.email}</span>}
                        </div>
                        <div className='pass-input'>
                            <input
                                type={PasswordInputType}
                                placeholder='Password'
                                name='password'
                                className='content'
                                onChange={handleChange}
                            />
                            <span className='password-icon-signin' onClick={change}>
                                <ToggleIcon />
                            </span>
                        </div>
                        <div className='error-mess'>
                            {errors.password && <span>{errors.password}</span>}
                        </div>
                        <div>
                            <button type='submit' className='login-btn'>Log in</button >
                        </div>
                        <div className='forgot'>
                            Forgot your password?
                        </div>
                    </div>
                    <div className='text02'>
                        Don't have an account? <span className="green">Sign up now</span>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default SignIn;