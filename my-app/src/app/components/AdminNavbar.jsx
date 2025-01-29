"use client";

import { React, useState, useEffect } from "react";
import Image from "next/image";
import { CiPower } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../action";
import { toast } from "react-toastify";


import { TfiAnnouncement } from "react-icons/tfi";

const AdminNavbar = () => {
  const user = "admin";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      // console.log("Token:", token.value);
      if (token?.value) {
        const decoded = jwtDecode(token.value);
        console.log("Decoded token:", decoded);
        setUserId(decoded.data.id);
        setUserRole(decoded.data.role);
        // console.log("User ROle:",decoded.data.role)
      }
    };
    checkToken();
  }, []);

  const handleAgentVerification = async () => {
    if (!userId || !userRole) {
      setMessage("User ID or role not found");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken(); // Fetch the token
      if (!token?.value) {
        setMessage("Authentication token not found.");
        return;
      }
      console.log("Token trying:",token.value)
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/auth/agent-verification`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
          },
          body: JSON.stringify({
            id: userId,
            role: "agent",
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("Verification request sent successfully!"|| data.message);
        console.log("verification request sent")
        toast.success("Verification request sent successfully!"||data.message)

      } else {
        setMessage(data.message || "Failed to send verification request.");
        toast.error(data.message|| "Failed to send verification request.")
      }
    } catch (error) {
      setMessage("An error occurred while sending the request.");
      toast.error("Connection error. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const agentRole = true;

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <TfiAnnouncement />

          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        {/* {!agentRole ? (): ()} */}
        {!userRole?.agent && (
          <div>
            <button
              type="button"
              className="text-sm  text-white font-semibold bg-[#30AD8F] bg-opacity-60 p-3 rounded-lg"
              onClick={handleAgentVerification}
              disabled={loading}
            >
              {loading ? "Sending..." : "Agent Verification"}
            </button>
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">Suyog Acharya</span>
          <span className="text-[10px] text-gray-500 text-right">{user}</span>
        </div>
        {/* <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/> */}
        {/* <UserButton /> */}
        <CiPower />{" "}
      </div>
    </div>
  );
};

export default AdminNavbar;
