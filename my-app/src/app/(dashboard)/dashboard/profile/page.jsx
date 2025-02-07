"use client";
import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const ProfileUpdate = () => {
  const userData = useSelector((state) => state.user.data);

  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [nameForm, setNameForm] = useState({
    firstName: userData?.firstName || "",
    middleName: userData?.middleName || "",
    lastName: userData?.lastName || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateName = (name) => {
    return name.length >= 2 && /^[a-zA-Z\s]*$/.test(name);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(nameForm.firstName) || !validateName(nameForm.lastName)) {
      toast.error(
        "Names must be at least 2 characters and contain only letters"
      );
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.baseUrl}${process.env.version}/users/edit-profile`,
        {
          firstName: nameForm.firstName,
          middleName: nameForm.middleName,
          lastName: nameForm.lastName,
        }
      );
      toast.success("Name updated successfully");
      setShowNameModal(false);
    } catch (error) {
      toast.error("Failed to update name");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(passwordForm.newPassword)) {
      toast.error("Password doesn't meet requirements");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.baseUrl}${process.env.version}/users/edit-profile?user_id=${userData.id}`,
        {
          password: passwordForm.newPassword,
        }
      );
      toast.success("Password updated successfully");
      setShowPasswordModal(false);
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };
  const roles = userData?.role
    ? Object.entries(JSON.parse(userData.role))
        .filter(([_, value]) => value) // Get only roles that are true
        .map(([key]) => key.toUpperCase()) // Convert keys to uppercase
        .join(", ") // Join them with a comma
    : "No Role Assigned"; // Default text if no role is found
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer position="top-right" />
      <div className="max-w-2xl mr-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {userData?.firstName}'s Profile
        </h1>

        {/* User Info Display */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-2 gap-4">
         
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">
                {userData?.firstName} {userData?.middleName}{" "}
                {userData?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{userData?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{userData?.phoneNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium">{roles}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowNameModal(true)}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center"
          >
            <FaUser className="text-2xl text-blue-500 mb-2" />
            <h2 className="text-sm font-semibold">Update Name</h2>
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center"
          >
            <FaLock className="text-2xl text-green-500 mb-2" />
            <h2 className="text-sm font-semibold">Update Password</h2>
          </button>
        </div>

        {showNameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Update Name</h2>
              <form onSubmit={handleNameSubmit}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={nameForm.firstName}
                      onChange={(e) =>
                        setNameForm({ ...nameForm, firstName: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={nameForm.middleName}
                      onChange={(e) =>
                        setNameForm({ ...nameForm, middleName: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={nameForm.lastName}
                      onChange={(e) =>
                        setNameForm({ ...nameForm, lastName: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNameModal(false)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Update Name"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Update Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Password must contain at least 8 characters, including
                    uppercase, lowercase, number, and special character.
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileUpdate;
