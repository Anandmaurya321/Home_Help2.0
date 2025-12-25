

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VerifyEmail } from '../../components/admin/admin_veri';

// Main App Component
export default function AdminVerification() {
  // Restoring react-router-dom hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationcode, setVerificationcode] = useState('');
  const token = data.auth;


  useEffect(() => {  // If the form data changed::>>>
    if (data) {
      setName(data.name);
      setEmail(data.email);
      setVerificationcode(data.verificationcode);
    }
    else {
      // If no data is passed from a previous page, redirect to register
      navigate('/adminpanel');
    }
  }, [data, navigate]);   // taking the data here


  const [page, setPage] = useState('verify'); // 'verify' or 'success' // need to verify::>>


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
  
  // if page is not success:::>>> still need to verify::>>>> // returning the component:::>>> with two props :: function and data to verify email component :::::>>>>
  return <VerifyEmail onVerifySuccess={() => setPage('success')} data={{ name, email, verificationcode , token}} />
}