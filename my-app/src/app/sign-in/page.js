// "use client";

// import { useState } from "react";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa6";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// const AuthPage = () => {
//   const router = useRouter();
//   const [isLogin, setIsLogin] = useState(true);
//   // const baseUrl = process.env.baseUrl;
//   // const version = process.env.version;
//   const baseUrl = "http://localhost:5000/";
//   const version = "api/v1/";

//   // const [formData, setFormData] = useState({});

//   const [loginForm, setLoginForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [showOTPVerification, setShowOTPVerification] = useState(false);

//   const [signupForm, setSignupForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone_no: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loginPassword, setLoginPassword] = useState(false);
//   const [showSignupPassword, setShowSignupPassword] = useState(false);
//   const [showSignupRePassword, setShowSignupRePassword] = useState(false);

//   const togglePassword = (passwordType) => {
//     if (passwordType === "loginPassword") {
//       setLoginPassword((prev) => !prev);
//     } else if (passwordType === "signupPassword") {
//       setShowSignupPassword((prev) => !prev);
//     } else if (passwordType === "signupRePassword") {
//       setShowSignupRePassword((prev) => !prev);
//     }
//   };

//   const handleChange = (e, formType) => {
//     const { name, value } = e.target;

//     if (formType == "login") {
//       setLoginForm((loginForm) => ({
//         ...loginForm,
//         [name]: value,
//       }));
//     } else if (formType == "signup") {
//       setSignupForm((signupForm) => ({
//         ...signupForm,
//         [name]: value,
//       }));
//     }
//   };

//   const validateForm = (formType) => {
//     const errors = {};

//     if (formType === "login") {
//       if (!loginForm.email.trim()) {
//         errors.email = "Email is required";
//       } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
//         errors.email = "Email is invalid";
//       }
//       if (!loginForm.password) {
//         errors.password = "Password is required";
//       }
//     } else if (formType == "signup") {
//       if (!signupForm.firstName.trim()) {
//         errors.firstName = "First name is required";
//       }
//       if (!signupForm.lastName.trim()) {
//         errors.lastName = "Last name is required";
//       }

//       if (!signupForm.email.trim()) {
//         errors.email = "Email is required";
//       } else if (!/\S+@\S+\.\S+/.test(signupForm.email)) {
//         errors.email = "Email is invalid";
//       }

//       if (!signupForm.phone_no.trim()) {
//         errors.phone_no = "Phone number is required";
//       } else if (!/^\d+$/.test(signupForm.phone_no)) {
//         errors.phone_no = "Phone number must contain only numbers";
//       } else if (signupForm.phone_no.length < 10) {
//         errors.phone_no = "Phone number must be at least 10 characters long";
//       }

//       if (!signupForm.password) {
//         errors.password = "Password is required";
//       } else if (signupForm.password.length < 8) {
//         errors.password = "Password must be at least 8 characters long";
//       }

//       if (signupForm.confirmPassword !== signupForm.password) {
//         errors.confirmPassword = "Passwords do not match";
//       }
//     }
//     return errors;
//   };

//   const handleSubmit = async (e, formType) => {
//     e.preventDefault();
//     const newErrors = validateForm(formType);
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       if (formType === "login") {
//         console.log("Login form submitted:", loginForm);
//         try {
//           console.log("Sending login request with data:", {
//             email: loginForm.email,
//             password: loginForm.password,
//           });

//           const response = await fetch(`${baseUrl}${version}/auth/login`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//             body: JSON.stringify({
//               email: loginForm.email,
//               password: loginForm.password,
//             }),
//           });

//           console.log("Raw Response:", response);

//           const data = await response.json();
//           // console.log("Response Data:", data);

//           if (response.ok) {
//             console.log("Login successful:", data);
//             alert(data.message || "Logged In successfully!");
//             // create(data.token);
//             router.push("/");
//           } else {
//             console.error("Login failed:", data);
//             alert(data.message || "Login Failed");
//           }
//         } catch (error) {
//           console.error("Detailed Network Error:", {
//             name: error.name,
//             message: error.message,
//             stack: error.stack,
//           });
//           alert("Unable to connect to server. Please check your connection.");
//         }
//       } else if (formType === "signup") {
//         try {
//           console.log("Sending signup request with data:", {
//             firstName: signupForm.firstName,
//             lastName: signupForm.lastName,
//             email: signupForm.email,
//             phone_no: signupForm.phone_no,
//             password: signupForm.password,
//           });

//           const response = await fetch(`${baseUrl}${version}/auth/register`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               firstName: signupForm.firstName,
//               lastName: signupForm.lastName,
//               email: signupForm.email,
//               phone_no: signupForm.phone_no,
//               password: signupForm.password,
//             }),
//           });

//           console.log("Raw Response:", response);

//           const data = await response.json();
//           console.log("Response Data:", data);

//           // if (response.ok) {
//           //   setSignupForm({
//           //     firstName: "",
//           //     lastName: "",
//           //     email: "",
//           //     phone_no: "",
//           //     password: "",
//           //     confirmPassword: "",
//           //   });
//           //   console.log("Signup successful:", data);
//           //   alert(data.message || "Registration successful!");
//           // } else {
//           //   console.error("Signup failed:", data);
//           //   alert(data.message || "Registration failed");
//           // }
//           if (response.ok) {
//             setShowOTPVerification(true);
//             // Don't reset the form yet - wait until OTP verification
//             console.log("Signup successful:", data);
//             // Don't redirect yet - wait for OTP verification
//           } else {
//             console.error("Signup failed:", data);
//             alert(data.message || "Registration failed");
//           }
//         } catch (error) {
//           console.error("Detailed Network Error:", {
//             name: error.name,
//             message: error.message,
//             stack: error.stack,
//           });
//           alert("Unable to connect to server. Please check your connection.");
//         }
//       }
//     } else {
//       console.log("Form submission failed due to validation errors.");
//     }
//   };

//   const toggleForm = () => setIsLogin(!isLogin);

//   return (
//     <div className=" flex m-10 items-center justify-center bg-grey-1000 h-[100vh] my-auto">
//       <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-10 flex items-center justify-center">
//         {/* Right Side Form (Login / SignUp) */}
//         <div className="w-full md:w-1/2 p-4">
//           <h2 className="text-3xl font-semibold text-center text-[#0450A4]">
//             {isLogin ? "Login" : "Sign Up"}
//           </h2>
//           <p className="text-center text-gray-500 mt-2">
//             {isLogin
//               ? "Login for your dream University"
//               : "Create an account to get started"}
//           </p>

//           {isLogin ? (
//             // This is section of Login forms
//             <form className="mt-6" onSubmit={(e) => handleSubmit(e, "login")}>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//                 value={loginForm.email}
//                 onChange={(e) => handleChange(e, "login")}
//               />
//               {errors.email && (
//                 <span className="text-red-700 text-xs">{errors.email}</span>
//               )}

//               <label
//                 htmlFor="password"
//                 className="block mt-4 text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>

//               <div className="relative flex items-center">
//                 <input
//                   type={loginPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter your password"
//                   className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//                   value={loginForm.password}
//                   onChange={(e) => handleChange(e, "login")}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => togglePassword("loginPassword")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {loginPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <span className="text-red-700 text-xs">{errors.password}</span>
//               )}

//               <div className="flex items-center justify-between mt-4">
//                 <a href="#" className="text-sm text-blue-600 hover:underline">
//                   Forgot Password?
//                 </a>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full mt-6 py-2 bg-[#0450A4] text-white rounded-md hover:bg-[#0362C7]"
//               >
//                 {isLogin ? "Login" : "Sign Up"}
//               </button>
//             </form>
//           ) : (
//             // this is section of signup form
//             <form className="mt-6" onSubmit={(e) => handleSubmit(e, "signup")}>
//               <label
//                 htmlFor="fname"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="Enter your first name"
//                 className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//                 value={signupForm.firstName}
//                 onChange={(e) => handleChange(e, "signup")}
//               />
//               {errors.firstName && (
//                 <span className="text-red-700 text-xs">{errors.firstName}</span>
//               )}

//               <label
//                 htmlFor="lname"
//                 className="block text-sm mt-2 font-medium text-gray-700"
//               >
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Enter your last name"
//                 className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//                 value={signupForm.lastName}
//                 onChange={(e) => handleChange(e, "signup")}
//               />
//               {errors.lastName && (
//                 <span className="text-red-700 text-xs">{errors.lastName}</span>
//               )}

//               <label
//                 htmlFor="email"
//                 className="block text-sm mt-2 font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//                 value={signupForm.email}
//                 onChange={(e) => handleChange(e, "signup")}
//               />
//               {errors.email && (
//                 <span className="text-red-700 text-xs">{errors.email}</span>
//               )}

//               <label
//                 htmlFor="phone_no"
//                 className="block text-sm mt-2 font-medium text-gray-700"
//               >
//                 Phone Number
//               </label>

//               <input
//                 type="text"
//                 name="phone_no"
//                 placeholder="Enter your phone number "
//                 className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//                 value={signupForm.phone_no}
//                 onChange={(e) => handleChange(e, "signup")}
//                 maxLength={10}
//               />
//               {errors.phone_no && (
//                 <span className="text-red-700 text-xs">{errors.phone_no}</span>
//               )}

//               {/* Password */}
//               <label
//                 htmlFor="password"
//                 className="block mt-2 text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <div className="relative flex items-center">
//                 <input
//                   type={showSignupPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Password"
//                   className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//                   value={signupForm.password}
//                   onChange={(e) => handleChange(e, "signup")}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => togglePassword("signupPassword")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <span className="text-red-700 text-xs">{errors.password}</span>
//               )}

//               {/* Re-type Password */}
//               <label
//                 htmlFor="retype-password"
//                 className="block mt-2 text-sm font-medium text-gray-700"
//               >
//                 Re-type Password
//               </label>

//               <div className="relative flex items-center">
//                 <input
//                   type={showSignupRePassword ? "text" : "password"}
//                   name="confirmPassword"
//                   placeholder="Re-type your password"
//                   className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//                   value={signupForm.confirmPassword}
//                   onChange={(e) => handleChange(e, "signup")}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => togglePassword("signupRePassword")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {showSignupRePassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <span className="text-red-700 text-xs">
//                   {errors.confirmPassword}
//                 </span>
//               )}

//               <button
//                 type="submit"
//                 className="w-full mt-6 py-2 bg-[#0450A4] text-white rounded-md hover:bg-[]#"
//               >
//                 {isLogin ? "Login" : "Sign Up"}
//               </button>
//             </form>
//           )}

//           <div className="text-center mt-4">
//             <p className="text-sm text-gray-600">
//               {isLogin ? "Don't have an account?" : "Already have an account?"}
//               <button
//                 className="text-blue-600 hover:underline ml-2"
//                 onClick={toggleForm}
//               >
//                 {isLogin ? "Sign up" : "Login"}
//               </button>
//             </p>

//             {/* <div className="mt-4 flex justify-center space-x-4">
//               <button className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center space-x-2">
//                 <FcGoogle />
//                 <span className="text-sm text-black">Login with Google</span>
//               </button>
//               <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center space-x-2">
//                 <FaApple />
//                 <span className="text-sm">Login with Apple</span>
//               </button>
//             </div> */}
//           </div>
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
// "use client"
// import { useState } from "react";

// const SimpleSignup = () => {
//   const [showOtpSection, setShowOtpSection] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone_no: "",
//     password: "",
//   });
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/api/v1/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setShowOtpSection(true);
//       } else {
//         setError(data.message || "Signup failed");
//       }
//     } catch (err) {
//       setError("Connection error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/api/v1/auth/verify-email", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: 'include',
//         body: JSON.stringify({ otp }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("Email verified successfully! You can now login.");
//         window.location.href = "/login"; // Redirect to login page
//       } else {
//         setError(data.message || "OTP verification failed");
//       }
//     } catch (err) {
//       setError("Connection error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (showOtpSection) {
//     return (
//       <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
//         <p className="text-center mb-6">
//           Please enter the OTP sent to {formData.email}
//         </p>
//         <form onSubmit={handleOtpSubmit} className="space-y-4">
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//             maxLength={6}
//             placeholder="Enter 6-digit OTP"
//             className="w-full p-3 border rounded-lg text-center text-lg tracking-widest"
//           />
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
//       <form onSubmit={handleSignup} className="space-y-4">
//         <div>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             placeholder="First Name"
//             required
//             className="w-full p-3 border rounded-lg"
//           />
//         </div>
//         <div>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             placeholder="Last Name"
//             required
//             className="w-full p-3 border rounded-lg"
//           />
//         </div>
//         <div>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             required
//             className="w-full p-3 border rounded-lg"
//           />
//         </div>
//         <div>
//           <input
//             type="text"
//             name="phone_no"
//             value={formData.phone_no}
//             onChange={handleChange}
//             placeholder="Phone Number"
//             required
//             maxLength={10}
//             className="w-full p-3 border rounded-lg"
//           />
//         </div>
//         <div>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Password"
//             required
//             minLength={8}
//             className="w-full p-3 border rounded-lg"
//           />
//         </div>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
//         >
//           {loading ? "Creating Account..." : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SimpleSignup;
"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_no: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.phone_no.trim()) {
        newErrors.phone_no = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone_no)) {
        newErrors.phone_no = "Phone number must be 10 digits";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the error as the user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          toast.success("Login successful!");
          router.push("/dashboard");
        } else {
          toast.success("Account created! Please verify your email.");
          router.push(`/verify-otp?email=${formData.email}`);
        }
      } else {
        // Show server-provided error message
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Connection error. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-blue-500`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-blue-500`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          {!isLogin && (
            <div>
              <input
                type="tel"
                name="phone_no"
                placeholder="Phone Number"
                value={formData.phone_no}
                onChange={handleChange}
                className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                  errors.phone_no ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-blue-500`}
              />
              {errors.phone_no && (
                <p className="text-red-500 text-xs mt-1">{errors.phone_no}</p>
              )}
            </div>
          )}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-blue-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? "Processing..." : isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;