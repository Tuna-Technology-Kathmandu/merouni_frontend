"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/app/utils/userSlice";

// Icons
import {
  FaHome,
  FaRegUserCircle,
  FaWpforms,
  FaBuilding,
  FaBriefcase,
} from "react-icons/fa";
import { BsNewspaper, BsCalendarEvent } from "react-icons/bs";
import { HiOutlineUsers, HiOutlineAcademicCap } from "react-icons/hi";
import { MdInsights, MdCategory, MdOutlinePermMedia } from "react-icons/md";
import { IoSchoolSharp } from "react-icons/io5";
import { RiUserSettingsLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
// import { GiHandshake } from "react-icons/gi";
import { FaHandshake } from "react-icons/fa";
import { MdBackHand } from "react-icons/md";
import { VscReferences } from "react-icons/vsc";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <FaHome className="text-xl" />,
        label: "Home",
        href: "/dashboard",
        visible: ["admin", "superadmin", "editor", "teacher", "student"],
      },
      {
        icon: <TbBrandGoogleAnalytics className="text-xl" />,
        label: "Insights",
        href: "/dashboard/insights",
        visible: ["admin", "superadmin"],
      },
      {
        icon: <HiOutlineUsers className="text-xl" />,
        label: "Users",
        href: "/dashboard/users",
        visible: ["admin", "superadmin", "editor"],
      },
      {
        icon: <HiOutlineAcademicCap className="text-xl" />,
        label: "Academia",
        href: "/dashboard/academia",
        visible: ["admin", "editor", "superadmin"],
      },
      {
        icon: <RiUserSettingsLine className="text-xl" />,
        label: "Agent Approve",
        href: "/dashboard/agentApprove",
        visible: ["admin", "superadmin"],
      },
      {
        icon: <FaBuilding className="text-xl" />,
        label: "Banner",
        href: "/dashboard/banner",
        visible: ["admin", "superadmin", "editor"],
      },
      {
        icon: <FaBriefcase className="text-xl" />,
        label: "Career",
        href: "/dashboard/career",
        visible: ["admin", "superadmin", "editor"],
      },
      {
        icon: <MdCategory className="text-xl" />,
        label: "Category",
        href: "/dashboard/category",
        visible: ["admin", "editor", "superadmin"],
      },
      {
        icon: <IoSchoolSharp className="text-xl" />,
        label: "Colleges",
        href: "/dashboard/addCollege",
        visible: ["admin", "editor", "superadmin"],
      },
      {
        icon: <FaHandshake className="text-xl" />,
        label: "Consultancy",
        href: "/dashboard/consultancy",
        visible: ["admin", "superadmin", "editor"],
      },
      {
        icon: <BsCalendarEvent className="text-xl" />,
        label: "Events",
        href: "/dashboard/events",
        visible: ["admin", "editor", "superadmin"],
      },

      {
        icon: <MdOutlinePermMedia className="text-xl" />,
        label: "Media",
        href: "/dashboard/media",
        visible: ["admin", "editor", "superadmin"],
      },
      {
        icon: <BsNewspaper className="text-xl" />,
        label: "News",
        href: "/dashboard/news",
        visible: ["admin", "editor", "superadmin"],
      },
      {
        icon: <MdBackHand />,
        label: "Refer Student",
        href: "/dashboard/referStudent",
        visible: ["agent"],
      },
      {
        icon: <VscReferences />,
        label: "Referrals",
        href: "/dashboard/referrals",
        visible: ["admin", "superadmin"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <FaRegUserCircle className="text-xl" />,
        label: "Update Profile",
        href: "/dashboard/profile",
        visible: ["admin", "editor", "superadmin", "agent", "student"],
      },
      {
        icon: <BiLogOut className="text-xl" />,
        label: "Logout",
        href: "/dashboard/logout",
        visible: ["admin", "editor", "superadmin", "agent", "student"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const role = useSelector((state) => {
    const roleData = state.user?.data?.role;
    return roleData ? JSON.parse(roleData) : {};
  });

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Logout failed");

      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(removeUser());
      localStorage.removeItem("refreshToken");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-full h-full px-2 py-4 bg-white">
      <div className="flex flex-col h-full space-y-6">
        {menuItems.map((menu) => (
          <div key={menu.title} className="flex flex-col space-y-2">
            <h2 className="hidden lg:block text-xs font-semibold text-gray-400 px-4">
              {menu.title}
            </h2>
            <div className="flex flex-col space-y-1">
              {menu.items.map((item) => {
                const hasAccess = item.visible.some((r) => role[r] === true);

                if (!hasAccess) return null;

                const isActive = pathname === item.href;
                const itemClasses = `
                  flex items-center w-full p-2 text-gray-600 transition-colors rounded-lg
                  hover:bg-gray-100 hover:text-blue-600
                  ${isActive ? "bg-blue-50 text-blue-600" : ""}
                  group
                `;

                if (item.href === "/dashboard/logout") {
                  return (
                    <button
                      key={item.label}
                      onClick={handleLogout}
                      className={itemClasses}
                    >
                      <span className="flex items-center justify-center w-8 h-8 text-gray-500 group-hover:text-blue-600">
                        {item.icon}
                      </span>
                      <span className="hidden lg:block ml-3 text-sm font-medium">
                        {item.label}
                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={itemClasses}
                  >
                    <span className="flex items-center justify-center w-8 h-8 text-gray-500 group-hover:text-blue-600">
                      {item.icon}
                    </span>
                    <span className="hidden lg:block ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Menu;
