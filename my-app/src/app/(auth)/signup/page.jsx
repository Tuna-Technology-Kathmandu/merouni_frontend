"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const baseUrl = process.env.baseUrl;
  const version = process.env.version;
  const router = useRouter();

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_no: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupRePassword, setShowSignupRePassword] = useState(false);

  const togglePassword = (passwordType) => {
    if (passwordType === "signupPassword") {
      setShowSignupPassword((prev) => !prev);
    } else if (passwordType === "signupRePassword") {
      setShowSignupRePassword((prev) => !prev);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSignupForm((signupForm) => ({
      ...signupForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!signupForm.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!signupForm.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!signupForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupForm.email)) {
      errors.email = "Email is invalid";
    }
    if (!signupForm.phone_no.trim()) {
      errors.phone_no = "Phone Number is required";
    } else if (!/^\d+$/.test(signupForm.phone_no)) {
      errors.phone_no = "Phone number must contain only numbers";
    } else if (signupForm.phone_no.length < 10) {
      errors.phone_no = "Phone number must be at least 10 characters long";
    }

    if (!signupForm.password) {
      errors.password = "Password is required";
    } else if (signupForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (signupForm.confirmPassword !== signupForm.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${baseUrl}${version}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: signupForm.firstName,
            lastName: signupForm.lastName,
            email: signupForm.email,
            phone_no: signupForm.phone_no,
            password: signupForm.password,
          }),
        });


        const data = await response.json();

        if (response.ok) {
          setSignupForm({
            firstName: "",
            lastName: "",
            email: "",
            phone_no: "",
            password: "",
            confirmPassword: "",
          });
          alert(data.message || "Registration successful!");
          router.push("/verifyemail");
        } else {
          console.error("Signup failed:", data);
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
    } else {
    }
  };

  return (
    <div className=" flex m-10 items-center justify-center bg-grey-1000 h-[100vh] my-auto">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-10 flex items-center justify-center">
        {/* Right Side Form (Login / SignUp) */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-semibold text-center text-[#0450A4]">
            Sign Up{" "}
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Create an account to get started
          </p>
          {/* signup form  */}
          <form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
            <label
              htmlFor="fname"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
              value={signupForm.firstName}
              onChange={(e) => handleChange(e)}
            />
            {errors.firstName && (
              <span className="text-red-700 text-xs">{errors.firstName}</span>
            )}

            <label
              htmlFor="lname"
              className="block text-sm mt-2 font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
              value={signupForm.lastName}
              onChange={(e) => handleChange(e)}
            />
            {errors.lastName && (
              <span className="text-red-700 text-xs">{errors.lastName}</span>
            )}

            <label
              htmlFor="email"
              className="block text-sm mt-2 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
              value={signupForm.email}
              onChange={(e) => handleChange(e)}
            />
            {errors.email && (
              <span className="text-red-700 text-xs">{errors.email}</span>
            )}

            <label
              htmlFor="phone_no"
              className="block text-sm mt-2 font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phone_no"
              placeholder="Enter your phone number"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
              value={signupForm.phone_no}
              onChange={(e) => handleChange(e)}
              maxLength={10}
            />
            {errors.phone_no && (
              <span className="text-red-700 text-xs">{errors.phone_no}</span>
            )}

            {/* Password */}
            <label
              htmlFor="password"
              className="block mt-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showSignupPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
                value={signupForm.password}
                onChange={(e) => handleChange(e)}
              />
              <button
                type="button"
                onClick={() => togglePassword("signupPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-700 text-xs">{errors.password}</span>
            )}

            {/* Re-type Password */}
            <label
              htmlFor="retype-password"
              className="block mt-2 text-sm font-medium text-gray-700"
            >
              Re-type Password
            </label>

            <div className="relative flex items-center">
              <input
                type={showSignupRePassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-type your password"
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
                value={signupForm.confirmPassword}
                onChange={(e) => handleChange(e)}
              />
              <button
                type="button"
                onClick={() => togglePassword("signupRePassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showSignupRePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-700 text-xs">
                {errors.confirmPassword}
              </span>
            )}

            <button
              type="submit"
              className="w-full mt-6 py-2 bg-[#0450A4] text-white rounded-md hover:bg-[]#"
            >
              Sign Up
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?
              <button
                className="text-blue-600 hover:underline ml-2"
                onClick={() => {
                  router.push("/signin");
                }}
              >
                Login
              </button>
            </p>

            <div className="mt-4 flex justify-center space-x-4">
              <button className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center space-x-2">
                <FcGoogle />
                <span className="text-sm text-black">Login with Google</span>
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center space-x-2">
                <FaApple />
                <span className="text-sm">Login with Apple</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
