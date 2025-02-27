"use client";

import React, { useState, useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { authFetch } from "@/app/utils/authFetch";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/newsletter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Subscribed successfully!");
        setEmail("");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Failed to subscribe. Please try again later.");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // 3000ms = 3 seconds

      // Cleanup timer on component unmount or if message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="relative bg-cover bg-center py-20 h-auto flex items-center px-4">
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-[#E0E0E0] bg-opacity-50"></div>

      <div className="relative container mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-48 text-center md:text-left">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-bold md:text-5xl md:font-extrabold mb-2">
            News Letter
          </h2>
          <p className="font-medium  mt-2">
            Get the latest exam updates, study resources, and{" "}
            <br className="hidden md:block" />
            expert tips delivered straight to your inbox.
          </p>
        </div>

        {/* Right Section - Input and Button */}
        <form
          onSubmit={handleSubmit}
          className="mt-2 flex flex-row items-center bg-[#eaf4f3] rounded-xl shadow-md w-full md:w-1/2"
        >
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow w-full px-4 py-4 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none rounded-t-xl md:rounded-t-none md:rounded-l-xl"
          />
          <button
            type="submit"
            className="bg-[#30AD8F] bg-opacity-20 py-6 px-6 rounded-r-xl flex items-center justify-center hover:bg-[#288c74] transition-colors"
          >
            Send
            <span className="ml-2">
              <FaLocationArrow className="rotate-45 " />
            </span>
          </button>
        </form>

        {/* Message Feedback */}
        {message && (
          <p className="text-center md:text-left mt-2 text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
