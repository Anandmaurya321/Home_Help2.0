
import React, { useState } from 'react';

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import {FormLogo , LoadingSpinner , ErrorDisplay} from '../../components/user/register'

import API from '../../hooks/api'


// --- Registration Form Component ---
// This component now takes a prop 'onRegisterSuccess' which will be the navigation function.
const RegisterForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleRegister = async () => {
        
        setError(null);

        if (!name || !email || !password) {
            setError('All fields are required.');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            await API.post('/register', { name, email, password })
            .then((res)=>{
                const data = res.data
                console.log(data);
                localStorage.setItem('otpSend', true);
                localStorage.setItem('email', email);
                navigate('/verifyemail', { state: {data} }); 
            })
            .catch((err)=>{
                console.log('here is error:' , err);
                setError(err?.response?.data?.result|| err || `Server error`);
            })

        } 
        catch (err) {
            console.error('Registration fetch error:', err);
            setError('Could not connect to the server. Please try again later.');
        } 
        finally {
            setIsLoading(false);
        }
    };  

    return (
        // This wrapper div is the only change. It centers the form on the page.
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <FormLogo />
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Create an Account</h1>
                    <p className="mt-2 text-sm text-gray-600">Join our community and start your journey.</p>
                </div>
                <ErrorDisplay message={error} />
                <div className="space-y-4">
                    {[
                        { id: 'name', type: 'text', placeholder: 'Full Name', value: name, setter: setName },
                        { id: 'email', type: 'email', placeholder: 'Email Address', value: email, setter: setEmail },
                        { id: 'password', type: 'password', placeholder: 'Password (min. 8 characters)', value: password, setter: setPassword }
                    ].map(field => (
                        <div key={field.id}>
                            <label htmlFor={field.id} className="sr-only">{field.placeholder}</label>
                            <input id={field.id} type={field.type} placeholder={field.placeholder} value={field.value} onChange={(e) => field.setter(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300" disabled={isLoading} />
                        </div>
                    ))}
                </div>
                <div>
                    <button onClick={handleRegister} disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-300">
                        {isLoading ? <LoadingSpinner /> : 'Create Account'}
                    </button>
                </div>
                <div className="text-center text-sm text-gray-600">
                    <p>Already have an account? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign In</a></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;



