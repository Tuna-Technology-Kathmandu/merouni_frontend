"use client";
import React, { useState } from "react";

const OTPverify = () => {
  const baseUrl = process.env.baseUrl;
  const version = process.env.version;

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({})

  const validateOTP = ()=> {
    if (!otp.trim()) {
      errors.phone_no = "OTP is required";
    } else if (!/^\d+$/.test(otp)) {
      errors.phone_no = "OTP must contain only numbers";
    } 
    return errors
  }

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateOTP();
    setErrors(newErrors);
if (Object.keys(newErrors).length === 0){


    try {
      console.log("Sending verify request with otp:", {
        otp: parseInt(otp),
      });

      const response = await fetch(`${baseUrl}${version}/auth/verify-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          otp: parseInt(otp),
        }),
      });

      console.log("Raw Response:", response);

      const data = await response.json();

      if (response.ok) {
        console.log("Verification successful:", data);
        alert(data.message || "Verified successfully!");
        // router.push("/sign-in"); // Navigate to sign-in page after successful verification
      } else {
        console.error("Verification failed:", data);
        alert(data.message || "Verification Failed");
      }
    } catch (error) {
      console.error("Detailed Network Error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      alert("Unable to connect to server. Please check your connection.");
    }
   }
    else {
      console.log("Form submission failed due to validation errors.");
    }
  };

  return (
    <div className="flex m-10 items-center justify-center bg-grey-1000 h-[100vh] my-auto">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-10 flex items-center justify-center">
        {/* Right Side Form (Login / SignUp) */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-semibold text-center text-[#0450A4]">
            Verify Email
          </h2>
          <form className="mt-6" onSubmit={handleSubmit}>
            <label htmlFor="otp">OTP:</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter your OTP"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
              onChange={handleChange}
            />
            <div className="items-center flex justify-center">
              <button
                type="submit"
                className="w-20 mt-6 py-2 bg-[#0450A4] text-white rounded-md hover:bg-[#0450A4]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPverify;
