"use client";
import React, { useState } from "react";

const verifyEmail = () => {
  const [otp, setOtp] = useState("");
  const baseUrl = process.env.baseUrl;
  const version = process.env.version;
  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}${version}/auth/verify-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        // withCredentials: true,
        body: JSON.stringify({
          otp: parseInt(otp),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtp("");
        alert(data.message || "Registration successful!");
      } else {
        console.error("Veification failed:", data);
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Detailed Network Error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      alert("Unable to connect to server. Please check your connection.");
    }
  };

  return (
    <div className=" flex m-10 items-center justify-center bg-grey-1000 h-[100vh] my-auto">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-10 flex items-center justify-center">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-semibold text-center text-[#0450A4]">
            Enter your OTP
          </h2>
          <form className="mt-6" onSubmit={handleSubmit}>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP
            </label>
            <input
              type="text"
              name="otp"
              placeholder="Enter your OTP here.."
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
              onChange={(e) => handleChange(e)}
            />

            <button type="button" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default verifyEmail;
