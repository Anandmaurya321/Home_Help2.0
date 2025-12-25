
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VerifyNewPassword } from '../../components/user/verifyNewPassword';

export default function VerifyNewUserPassword() {
  // Restoring react-router-dom hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationcode, setVerificationcode] = useState('');
  const [id , setId ] = useState('');
  useEffect(() => {
    if (data) {
      setName(data.name);
      setEmail(data.email);
      setPassword(data.password); // hashed password ::: 
      setVerificationcode(data.verificationcode); // verification code :::
      setId(data._id);
    }
    else {
      // If no data is passed from a previous page, redirect to register
      navigate('/register');
    }
  }, [data, navigate]);   // taking the data here

  const [page, setPage] = useState('verify'); // 'verify' or 'success'


  // This useEffect handles the redirect after successful verification
  useEffect(() => {
    if (page === 'success') {
      const timer = setTimeout(() => {
        navigate('/'); // Navigate to the home page
      }, 2000); // 2 second delay
      return () => clearTimeout(timer);
    }
  }, [page, navigate]); // Dependencies for the effect

  if (page === 'success') {
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('isLoggedIn', 'true');
    // This tells the Nav component (and any other component) that the login state has changed.
    window.dispatchEvent(new Event('storageChange'));
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-green-500">Password Updted!</h1>
          <p className="mt-4 text-gray-600">You have been successfully created New Password. Redirecting...</p>
          <h1>Welcome {name} ! </h1>
        </div>
      </div>
    );
  }

  return <VerifyNewPassword onVerifySuccess={() => setPage('success')} data={{ name, email, password, verificationcode}} />
}






