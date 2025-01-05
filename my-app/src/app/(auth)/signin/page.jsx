// "use client";

// import { useState } from "react";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa6";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// const SignIn = () => {
//   const baseUrl = process.env.baseUrl;
//   console.log(baseUrl);
//   const version = process.env.version;
//   console.log(version);
//   const router = useRouter();
//   const [isLogin, setIsLogin] = useState(true);

//   const [loginForm, setLoginForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loginPassword, setLoginPassword] = useState(false);

//   const togglePassword = () => {
//     setLoginPassword((prev) => !prev);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setLoginForm((loginForm) => ({
//       ...loginForm,
//       [name]: value,
//     }));
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!loginForm.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
//       errors.email = "Email is invalid";
//     }
//     if (!loginForm.password) {
//       errors.password = "Password is required";
//     }
//   }; // <- This extra closing brace was the problem
//   return errors;
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const newErrors = validateForm();
//   setErrors(newErrors);

//   if (Object.keys(newErrors).length === 0) {
//     console.log("Login form submitted:", loginForm);
//     try {
//       console.log("Sending login request with data:", {
//         email: loginForm.email,
//         password: loginForm.password,
//       });

//       const response = await fetch(`${baseUrl}${version}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           email: loginForm.email,
//           password: loginForm.password,
//         }),
//       });

//       console.log("Raw Response:", response);

//       const data = await response.json();
//       // console.log("Response Data:", data);

//       if (response.ok) {
//         console.log("Login successful:", data);
//         alert(data.message || "Logged In successfully!");
//         // create(data.token);
//         router.push("/");
//       } else {
//         console.error("Login failed:", data);
//         alert(data.message || "Login Failed");
//       }
//     } catch (error) {
//       console.error("Detailed Network Error:", {
//         name: error.name,
//         message: error.message,
//         stack: error.stack,
//       });
//       alert("Unable to connect to server. Please check your connection.");
//     }
//   } else {
//     console.log("Form submission failed due to validation errors.");
//   }
// };

// const toggleForm = () => setIsLogin(!isLogin);

// return (
//   <div className=" flex m-10 items-center justify-center bg-grey-1000 h-[100vh] my-auto">
//     <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-10 flex items-center justify-center">
//       <div className="w-full md:w-1/2 p-4">
//         <h2 className="text-3xl font-semibold text-center text-[#0450A4]">
//           Login
//         </h2>
//         <p className="text-center text-gray-500 mt-2">
//           Login for your dream University
//         </p>

//         <form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//             className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//             value={loginForm.email}
//             onChange={(e) => handleChange(e)}
//           />
//           {errors.email && (
//             <span className="text-red-700 text-xs">{errors.email}</span>
//           )}

//           <label
//             htmlFor="password"
//             className="block mt-4 text-sm font-medium text-gray-700"
//           >
//             Password
//           </label>

//           <div className="relative flex items-center">
//             <input
//               type={loginPassword ? "text" : "password"}
//               name="password"
//               placeholder="Enter your password"
//               className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0450A4]"
//               value={loginForm.password}
//               onChange={(e) => handleChange(e)}
//             />
//             <button
//               type="button"
//               onClick={togglePassword}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//             >
//               {loginPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>
//           {errors.password && (
//             <span className="text-red-700 text-xs">{errors.password}</span>
//           )}

//           <div className="flex items-center justify-between mt-4">
//             <a href="#" className="text-sm text-blue-600 hover:underline">
//               Forgot Password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-6 py-2 bg-[#0450A4] text-white rounded-md hover:bg-[#0362C7]"
//           >
//             Login
//           </button>
//         </form>

//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-600">
//             {isLogin ? "Don't have an account?" : "Already have an account?"}
//             <button
//               className="text-blue-600 hover:underline ml-2"
//               onClick={toggleForm}
//             >
//               {isLogin ? "Sign up" : "Login"}
//             </button>
//           </p>

//           <div className="mt-4 flex justify-center space-x-4">
//             <button className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center space-x-2">
//               <FcGoogle />
//               <span className="text-sm text-black">Login with Google</span>
//             </button>
//             <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center space-x-2">
//               <FaApple />
//               <span className="text-sm">Login with Apple</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default SignIn;

"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const baseUrl = process.env.baseUrl;
  const version = process.env.version;
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginPassword, setLoginPassword] = useState(false);

  const togglePassword = () => {
    setLoginPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((loginForm) => ({
      ...loginForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!loginForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = "Email is invalid";
    }
    if (!loginForm.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${baseUrl}${version}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(loginForm),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || "Logged In successfully!");
          router.push("/");
        } else {
          alert(data.message || "Login Failed");
        }
      } catch (error) {
        alert("Unable to connect to server. Please check your connection.");
      }
    }
  };


  return (
    <div className="flex m-10 items-center justify-center bg-grey-1000 h-[100vh] my-auto">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-10 flex items-center justify-center">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-semibold text-center text-[#0450A4]">
            Login
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Login for your dream University
          </p>

          <form className="mt-6" onSubmit={handleSubmit}>
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
              onChange={handleChange}
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
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePassword}
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
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <button
                className="text-blue-600 hover:underline ml-2"
                onClick={()=>{
                  router.push('/signup')
                }}
              >
                Sign up
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

export default SignIn;
