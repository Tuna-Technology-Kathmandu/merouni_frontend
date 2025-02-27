"use client";
import { authFetch } from "@/app/utils/authFetch";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    fetchPendingRoles();
  }, []);

  const fetchPendingRoles = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/users/pending-role?role=agent`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );
      const data = await response.json();
      setPendingUsers(data.items);
    } catch (error) {
      console.error("Error fetching the pending roles:", error);
    }
  };

  useEffect(() => {
  }, []);

  const handleApproval = async (user_id, action) => {
    // setLoading(true);
    setLoading((prev) => ({ ...prev, [user_id]: true }));
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/users/review-agent`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            user_id,
            action,
          }),
        }
      );

      // Log the response status and status text

      // Try to get the response body even if it's an error
      const responseData = await response.json().catch((e) => null);

      if (response.ok) {
        await fetchPendingRoles();
        toast.success(`Agent status ${action} for id : ${user_id}`);
      } else {
        throw new Error(responseData?.message || "Failed to process request");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      // You might want to add user feedback here
    } finally {
      // setLoading(false);
      setLoading((prev) => ({ ...prev, [user_id]: false }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Agent Approval Requests</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pendingUsers?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  {`${user.firstName} ${user.middleName || ""} ${
                    user.lastName
                  }`}
                </td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-sm">{user.phoneNo}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleApproval(user.id, "approve")}
                    disabled={loading[user.id]}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm
                             disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading[user.id] ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleApproval(user.id, "reject")}
                    disabled={loading[user.id]}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm
                             disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading[user.id] ? "Processing..." : "Reject"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        { pendingUsers && pendingUsers.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No pending requests found
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
