
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon , Spinner } from '../../components/admin/adminPanel';
import API from '../../hooks/api';

const AdminLogin = () => {
    // State for all three input fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    
    
    const [message, setMessage] = useState({ text: '', isError: false });
    const [isLoading, setIsLoading] = useState(false);

    
    /**
     * Handles the admin login verification process.
     * It sends the username, email, and password to the backend and handles the response.
     */
    const adminCheck = async () => {
        // Prevent multiple submissions while one is in progress
        if (isLoading) return;

        // Basic validation to ensure fields are not empty
        if (!username || !email) {
            setMessage({ text: 'Please fill in all fields.', isError: true });
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', isError: false }); // Reset message on new attempt

        try {
            let data;
            await API.post("/adminpanel", {username, email})
            .then((res)=>{
                console.log(data)
                data = res.data;
            })
            .catch((err)=>{ // if response is not OK:::>>>
                console.log('api error in adminCheck in adminPanel' , err.message || err); 
                setMessage({ text: data.data || 'Invalid credentials or server error.', isError: true });
            })


            if(data.valid===0){
                console.log(data)
                alert(data.data);
                return ;
            }

            console.log(data)

            if(data.valid===1){
               localStorage.setItem('otpSend', true);
               navigate('/admin_veri' , { state: { data } })
            }
            
        } 
        catch (error) {
            // Handle network errors or issues with the fetch call itself
            console.error("Login failed:", error);
            setMessage({ text: 'Failed to connect to the server.', isError: true });
        }
        finally {
            // Ensure loading state is turned off after the process completes
            setIsLoading(false);
        }
    };

    // Handle form submission on Enter key press in any input
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            adminCheck();
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
                
                {/* Header section with Icon and Title */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                       <LockIcon />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Please enter your credentials to continue.</p>
                </div>

                {/* Form Section */}
                <div className="space-y-4">
                    {/* Username Input */}
                    <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <input 
                            id="username"
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
                            disabled={isLoading}
                        />
                    </div>

                   
                    {/* Submit Button */}
                    <button 
                        onClick={adminCheck}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <Spinner /> : 'Submit'}
                    </button>
                </div>

                {/* Message Display Area */}
                {message.text && (
                    <div className={`text-center text-sm font-medium ${message.isError ? 'text-red-500' : 'text-green-500'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;  // ::::>>>>



