import API from '../../hooks/api'
import React, { useState, useRef, useEffect } from 'react';

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-12 w-12 text-gray-500"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);


// The OTP Verification Component
const VerifyEmail = ({ onVerifySuccess, data }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const inputRefs = useRef([]);
  const { name, email, password } = data;
  const [verificationcode, setVerificationcode] = useState(data.verificationcode);

  useEffect(() => {
    if (data.verificationcode) setVerificationcode(data.verificationcode);
  }, [data.verificationcode]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setVerificationcode(null);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);


  // --- RESEND OTP ---
  const handleResend = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log("Resending OTP...");
      const res = await API.post('/register', { name, email, password });
      const responseData = res.data;

      localStorage.setItem('otpSend', true);
      setVerificationcode(responseData.verificationcode);
      setResendTimer(120);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Error in handleResend:", err);
      setError(err.response?.data?.message || err.message || "Could not resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };


  // --- OTP Input Handling ---
  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split('');
    setOtp(newOtp);
    inputRefs.current[5].focus();
  };


  // --- VERIFY OTP ---
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (verificationcode === null) {
      setError("Your OTP has expired. Please request a new one.");
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (code === verificationcode) {
        console.log('Verified successfully. Saving data to backend...');
        localStorage.removeItem('otpSend');

        const res = await API.post("/save_data", { name, email, password });
        const responseData = res.data;

        localStorage.setItem("name", name);
        localStorage.setItem('email', email);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginToken', responseData.auth);

        window.dispatchEvent(new Event('storageChange'));
        onVerifySuccess();
      } else {
        setError("Invalid OTP. Please try again.");
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg md:p-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <LockIcon />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Email Verification</h1>
        <p className="mt-2 text-gray-600">
          Please enter the 6-digit code sent to {email}.
        </p>

        {/* OTP Input Fields */}
        <div className="mt-8 flex justify-center gap-2 md:gap-4" onPaste={handlePaste}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className={`h-14 w-12 rounded-lg border text-center text-2xl font-semibold transition-all duration-200
                ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
                focus:ring-2`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <p className="mt-4 text-sm font-semibold text-red-500">{error}</p>}

        {/* Verify Button */}
        <div className="mt-8">
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className={`w-full rounded-lg px-4 py-3 text-lg font-semibold text-white shadow-md transition-all duration-200
              ${isLoading ? 'cursor-not-allowed bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify Account'
            )}
          </button>
        </div>

        {/* Resend OTP */}
        <div className="mt-6 text-sm text-gray-600">
          Didn't receive the code?{' '}
          {resendTimer > 0 ? (
            <span className="font-semibold text-gray-500">
              Resend in {resendTimer}s
            </span>
          ) : (
            <>
              {localStorage.removeItem('otpSend')}
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="font-semibold text-indigo-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Resend OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { VerifyEmail };

// send the verification code to your server for verification:::>>>
// do not send the verification code/otp to the frontend

