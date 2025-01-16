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
                maxLength={10}
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