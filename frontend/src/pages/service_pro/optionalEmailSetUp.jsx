
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingSpinner, FormLogo, ErrorDisplay } from '../../components/service_pro/register';
import API from '../../hooks/api'




// --- Optional Email Setup Component ---
// This component allows service providers to create a full account with email and password, or skip the step.
const OptionalEmailSetup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the service provider's ID from the previous page's state.
    const { data: serviceProviderId } = location.state || {};
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Simple email validation regex.
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleAccountSubmit = async () => {
        setError(null)

        // Validate all fields before submitting.
        if (!name || !email || !password) {
            setError('Please fill out all fields to create an account.');
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

        // if everything is fine
        setIsLoading(true);

        try {
            const res = await API.post('/servicepro_register', {
                name,
                email,
                password,
                _id: serviceProviderId,
            });

            const result = res.data;

            localStorage.setItem('otpSend', true);
            localStorage.setItem('email', email);

            console.log("moving to verifyService provider");

            navigate('/verify_ser', {
                state: { data: { result, _id: serviceProviderId } },
            });

        } catch (err) {
            console.error('Account submission error:', err);

            setError(
                err.response?.data?.result ||
                err.message ||
                'Server error'
            );
        }

        finally {
            setIsLoading(false);
        }
    };

    // function to skip that step:::>>>
    const handleSkip = () => {
        setTimeout(() => {
            alert("You are get added after verified by admin");
            navigate('/');
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                <div className="text-center">
                    <FormLogo />
                    <h1 className="text-3xl font-bold text-gray-800 mt-4">Create Your Account (Optional)</h1>
                    <p className="mt-2 text-md text-gray-600">
                        Create an account for easier login and to receive email notifications.
                        <br /> You can also <span className="font-semibold">skip this step</span> for now.
                    </p>
                </div>

                <ErrorDisplay message={error} />

                <div className="space-y-4">
                    <input id="name" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300" disabled={isLoading} />
                    <input id="email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300" disabled={isLoading} />
                    <input id="password" type="password" placeholder="Password (min. 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300" disabled={isLoading} />
                </div>

                <div className="flex flex-col sm:flex-row-reverse gap-4">
                    <button
                        onClick={handleAccountSubmit}
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Create Account & Verify'}
                    </button>
                    <button
                        onClick={handleSkip}
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-300"
                    >
                        Skip for Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptionalEmailSetup;



