


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from '../../hooks/api'


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        // Prevents the default form submission which reloads the page
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear previous errors on a new submission

        // Basic validation
        if (!email || !password) {
            setError('Please fill in both fields.');
            setIsLoading(false);
            return;
        }

        try {
            let data;
            API.post("/servicepro_login", {email, password })
            .then((res)=>{
              data = res.data;
            })
            .catch((err)=>{
              throw new Error(err.message || `HTTP error! `);
            })

            if (data.success===true) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', email);
                localStorage.setItem('loginToken' , data.auth )
                localStorage.setItem('ServicePro' , true);
                // This tells the Nav component (and any other component) that the login state has changed.
                window.dispatchEvent(new Event('storageChange'));
                navigate('/');
            } 
            else {
                setError(data.message || 'Invalid credentials. Please try again.');
            }

        } 
        catch (err) {
            console.error("Login failed:", err);
            setError(err.message || 'An unexpected error occurred. Please try again later.');
        } 
        finally {
            setIsLoading(false); // Re-enable the button
        }
    };

    const ForgotPassword = async () => {
        navigate('/forgotpassword');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    {/* If you have a logo, you can display it here */}
                    {/* <img className="mx-auto h-12 w-auto" src={logo} alt="Workflow" /> */}
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Display error message if it exists */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            < button onClick={ForgotPassword} className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;


