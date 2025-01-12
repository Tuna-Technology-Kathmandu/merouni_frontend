"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const baseUrl = process.env.baseUrl;
  const version = process.env.version;
  // const [formData, setFormData] = useState({});

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_no: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loginPassword, setLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupRePassword, setShowSignupRePassword] = useState(false);

  const togglePassword = (passwordType) => {
    if (passwordType === "loginPassword") {
      setLoginPassword((prev) => !prev);
    } else if (passwordType === "signupPassword") {
      setShowSignupPassword((prev) => !prev);
    } else if (passwordType === "signupRePassword") {
      setShowSignupRePassword((prev) => !prev);
    }
  };

  const handleChange = (e, formType) => {
    const { name, value } = e.target;

    if (formType == "login") {
      setLoginForm((loginForm) => ({
        ...loginForm,
        [name]: value,
      }));
    } else if (formType == "signup") {
      setSignupForm((signupForm) => ({
        ...signupForm,
        [name]: value,
      }));
    }
  };

  const validateForm = (formType) => {
    const errors = {};

    if (formType === "login") {
      if (!loginForm.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
        errors.email = "Email is invalid";
      }
      if (!loginForm.password) {
        errors.password = "Password is required";
      }
    } else if (formType == "signup") {
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
        errors.phone_no = "Phone number is required";
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
    }
    return errors;
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const newErrors = validateForm(formType);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (formType === "login") {
        console.log("Login form submitted:", loginForm);
        try {
          console.log("Sending login request with data:", {
            email: loginForm.email,
            password: loginForm.password,
          });

          const response = await fetch(`${baseUrl}${version}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: loginForm.email,
              password: loginForm.password,
            }),
          });

          console.log("Raw Response:", response);

          const data = await response.json();
          // console.log("Response Data:", data);

          // if (response.ok) {
          //   console.log("Login successful:", data);
          //   alert(data.message || "Logged In successfully!");
          //   // create(data.token);
          //   router.push("/");
          // } else {
          //   console.error("Login failed:", data);
          //   alert(data.message || "Login Failed");
          // }

          if (response.ok) {
            console.log("Login successful:", data);
            toast.success(data.message || "Logged In successfully!");
            router.push("/");
          } else {
            console.error("Login failed:", data);
            toast.error(data.message || "Login Failed");
          }
        } catch (error) {
          console.error("Detailed Network Error:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
          alert("Unable to connect to server. Please check your connection.");
        }
      } else if (formType === "signup") {
        try {
          console.log("Sending signup request with data:", {
            firstName: signupForm.firstName,
            lastName: signupForm.lastName,
            email: signupForm.email,
            phone_no: signupForm.phone_no,
            password: signupForm.password,
          });

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

          console.log("Raw Response:", response);

          const data = await response.json();
          console.log("Response Data:", data);

          // if (response.ok) {
          //   setSignupForm({
          //     firstName: "",
          //     lastName: "",
          //     email: "",
          //     phone_no: "",
          //     password: "",
          //     confirmPassword: "",
          //   });
          //   console.log("Signup successful:", data);
          //   alert(data.message || "Registration successful!");
          // } else {
          //   console.error("Signup failed:", data);
          //   alert(data.message || "Registration failed");
          // }
          if (response.ok) {
            setSignupForm({
              firstName: "",
              lastName: "",
              email: "",
              phone_no: "",
              password: "",
              confirmPassword: "",
            });
            console.log("Signup successful:", data);
            toast.success(data.message || "Registration successful!");
          } else {
            console.error("Signup failed:", data);
            toast.error(data.message || "Registration failed");
          }
        } catch (error) {
          console.error("Detailed Network Error:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
          // alert("Unable to connect to server. Please check your connection.");
          toast.error(
            "Unable to connect to server. Please check your connection."
          );
        }
      }
    } else {
      console.log("Form submission failed due to validation errors.");
    }
  };

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className=" flex m-10 items-center justify-center bg-grey-1000 h-[100vh] my-auto">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-10 flex items-center justify-center">
        {/* Right Side Form (Login / SignUp) */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-semibold text-center text-[#0450A4]">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <p className="text-center text-gray-500 mt-2">
            {isLogin
              ? "Login for your dream University"
              : "Create an account to get started"}
          </p>

          {isLogin ? (
            // This is section of Login forms
            <form className="mt-6" onSubmit={(e) => handleSubmit(e, "login")}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
                value={loginForm.email}
                onChange={(e) => handleChange(e, "login")}
              />
              {errors.email && (
                <span className="text-red-700 text-xs">{errors.email}</span>
              )}

              <label
                htmlFor="password"
                className="block mt-4 text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative flex items-center">
                <input
                  type={loginPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
                  value={loginForm.password}
                  onChange={(e) => handleChange(e, "login")}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("loginPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {loginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-700 text-xs">{errors.password}</span>
              )}

              <div className="flex items-center justify-between mt-4">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2 bg-[#0450A4] text-white rounded-md hover:bg-[#0362C7]"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
          ) : (
            // this is section of signup form
            <form className="mt-6" onSubmit={(e) => handleSubmit(e, "signup")}>
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
                onChange={(e) => handleChange(e, "signup")}
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
                onChange={(e) => handleChange(e, "signup")}
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
                onChange={(e) => handleChange(e, "signup")}
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
                placeholder="Enter your phone number "
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
                value={signupForm.phone_no}
                onChange={(e) => handleChange(e, "signup")}
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
                  onChange={(e) => handleChange(e, "signup")}
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
                  onChange={(e) => handleChange(e, "signup")}
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
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                className="text-blue-600 hover:underline ml-2"
                onClick={toggleForm}
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>

            {/* <div className="mt-4 flex justify-center space-x-4">
              <button className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center space-x-2">
                <FcGoogle />
                <span className="text-sm text-black">Login with Google</span>
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center space-x-2">
                <FaApple />
                <span className="text-sm">Login with Apple</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
