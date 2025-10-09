
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckIcon, ExclamationIcon } from '../../components/service_pro/forgotPassword';
import API from '../../hooks/api'


const ServiceProForgotPassword =  () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rewritePassword, setRewritePassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    

    const name = "Your New Password Verification Code";

    // password && rewritePassword && password===rewritePassword
    const isPasswordMatch = password && rewritePassword && password === rewritePassword;
    const isPasswordStrong = password.length >= 8;


    const handleVerify = async (e) => {
        e.preventDefault();   // prevent from default action :::>>>
        setError('');

        if (password !== rewritePassword) {
            setError("Passwords do not match.");
            return;
        }

        // Added for better UX
        if (!isPasswordStrong) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setIsLoading(true);


        // if the email is registered or not :::>>>

        try {
            let data
            await API.post("/findServicePro", { email }) 
                .then((res) => {
                    data = res.data;
                })
                .catch((err) => {
                    console.log('giving error in findUser', err)
                })

            if (!data.isEmail) {
                setError("That email is not Registered yet")
                setIsLoading(false);
                alert('Given email is not registered for service provider')
                return;
            }
        }

        catch (err) {
            console.error('Request error:', err);
            setError('Could not connect to the server. Please try again later.');
        }


        try {

            await API.post('/servicepro_register', { name, email, password, forgotPassword: true })  
                .then((res) => {
                    localStorage.setItem('otpSend', true);
                    const data = res.data
                    console.log(data);
                    navigate('/verifyNewServiceProPassword', { state: { data } }); // you are sending hashed password here :::>>
                })
                .catch((err) => {
                    console.log("giving error as :", err)
                    setError(err || `Server error`)
                })
        }
        catch (err) {
            console.error('Request error:', err);
            setError('Could not connect to the server. Please try again later.');
        }
        finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                {/* Header Section */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Set New Password</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Create a new password for: <span className="font-medium text-gray-800">{email}</span>
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleVerify} className="space-y-6">

                    {/* emai Input*/}
                    <div className="relative">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                            Registered Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            placeholder="Your Registered Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    {/* New Password Input */}
                    <div className="relative">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Write new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    {/* Rewrite Password Input */}
                    <div className="relative">
                        <label htmlFor="rewrite-password" className="block mb-2 text-sm font-medium text-gray-700">
                            Rewrite Password
                        </label>
                        <input
                            id="rewrite-password"
                            type="password"
                            placeholder="Rewrite password"
                            value={rewritePassword}
                            onChange={(e) => setRewritePassword(e.target.value)}
                            className={`w-full px-4 py-3 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${rewritePassword && (isPasswordMatch ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')
                                }`}
                            required
                        />
                        {rewritePassword && (
                            <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none">
                                {isPasswordMatch ? <CheckIcon /> : <ExclamationIcon />}
                            </div>
                        )}
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                        <div className="text-xs text-gray-500 space-y-1">
                            <p className={isPasswordStrong ? 'text-green-600' : 'text-red-600'}>
                                {isPasswordStrong ? '✓' : '✗'} At least 8 characters long.
                            </p>
                        </div>
                    )}

                    {/* Error Message Display */}
                    {error && (
                        <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg flex items-center space-x-2">
                            <ExclamationIcon />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !isPasswordMatch || !isPasswordStrong}
                            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>

                   
                    
                </form>
            </div>
        </div>
    );
}

export default ServiceProForgotPassword

