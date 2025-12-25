

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Verify_ser } from '../../components/service_pro/verifyServicePro';


export default function VerifyServicePro() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {}; /// props drilling :: 
  const { result, _id } = data || {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationcode, setVerificationcode] = useState('');
  const [page, setPage] = useState('verify'); // 'verify' or 'success'


  useEffect(() => {
    if (result) {
      setName(result.name);
      setEmail(result.email);
      setPassword(result.password);
      setVerificationcode(result.verificationcode);
      console.log("_id "  , _id)
    }
    else {
      // If no result is passed from a previous page, redirect to register
      navigate('/register');
    }
  }, [result, navigate]);   // taking the result here

  

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-green-500">Verification Successful!</h1>
          <p className="mt-4 text-gray-600">You have been successfully verified. Redirecting...</p>
        </div>
      </div>
    );
  }
  
  // if (page === verify) :: need to verify yet :::>>>> 
  return <Verify_ser onVerifySuccess={() => setPage('success')} data={ {name, email, password, verificationcode , _id} } />
}




