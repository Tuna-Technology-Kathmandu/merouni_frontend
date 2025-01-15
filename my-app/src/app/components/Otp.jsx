"use client"
import { useState, useRef, useEffect } from 'react';

const OTPInput = ({ onComplete }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleComplete = (otpValue) => {
    setError('');
    // Ensure OTP is exactly 6 digits and properly formatted
    const formattedOTP = otpValue.toString().padStart(6, '0');
    if (formattedOTP.length === 6 && /^\d{6}$/.test(formattedOTP)) {
      onComplete(formattedOTP);
    } else {
      setError('Please enter a valid 6-digit code');
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    // Only allow single digit
    const value = element.value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Check if all fields are filled
    const otpValue = newOtp.join('');
    if (otpValue.length === 6 && !newOtp.includes('')) {
      handleComplete(otpValue);
    }
  };

  const handleKeyDown = (e, index) => {
    // Clear error when user starts typing
    if (error) setError('');

    // Move to previous input on backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
    // Move to next input on right arrow
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    // Move to previous input on left arrow
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    setError('');
    
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData) {
      const newOtp = new Array(6).fill('');
      pastedData.split('').forEach((value, index) => {
        if (index < 6) newOtp[index] = value;
      });
      setOtp(newOtp);

      // Focus last filled input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex].focus();

      // Call handleComplete if all fields are filled
      if (pastedData.length === 6) {
        handleComplete(pastedData);
      }
    }
  };

  const handleResend = () => {
    setOtp(new Array(6).fill(''));
    setError('');
    inputRefs.current[0].focus();
    // You can add resend API call here
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="text-lg font-medium text-gray-700">Enter verification code</div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-12 h-12 sm:w-14 sm:h-14 text-2xl text-center border-2 border-gray-300 
                     rounded-lg focus:border-blue-500 focus:outline-none 
                     transition-colors duration-200"
          />
        ))}
      </div>
      <div className="text-sm text-gray-500">
        Didn't receive code?{' '}
        <button 
          className="text-blue-500 hover:text-blue-600"
          onClick={handleResend}
        >
          Resend
        </button>
      </div>
    </div>
  );
};

export default OTPInput;