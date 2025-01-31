"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdEmojiEvents } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineSettings, MdOutlinePermMedia } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { IoSchoolSharp } from "react-icons/io5";
import clsx from "clsx";
import { HiOutlineUsers } from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { GrCertificate } from "react-icons/gr";


import { FaWpforms } from "react-icons/fa";


const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <FaHome />,
        label: "Home",
        href: "/dashboard",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <HiOutlineUsers />,
        label: "Users",
        href: "/dashboard/users",
        visible: ["admin"],
      },
      {
        icon: <IoSchoolSharp />,
        label: "Colleges",
        href: "/dashboard/addCollege",
        visible: ["admin"],
      },
      {
        icon: <MdOutlinePermMedia />,
        label: "Media",
        href: "/dashboard/media",
        visible: ["admin"],
      },
      {
        icon: <GrCertificate />,
        label: "Academia",
        href: "/dashboard/academia",
        visible: ["admin"],
      },
      {
        icon: <MdCategory />,
        label: "Category",
        href: "/dashboard/category",
        visible: ["admin"],
      },
      {
        icon: <GrUserWorker />,
        label: "Agents",
        href: "/dashboard/agent",
        visible: ["admin", "teacher"],
      },
      {
        icon: <HiOutlineDocumentReport />,
        label: "Results",
        href: "/dashboard/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <MdEmojiEvents />,
        label: "News",
        href: "/dashboard/news",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <MdEmojiEvents />,
        label: "Events",
        href: "/dashboard/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <TfiAnnouncement />,
        label: "Announcements",
        href: "/dashboard/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <FaWpforms />,
        label: "Apply for agent",
        href: "/dashboard/ApplyAgent",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <FaRegUserCircle />,
        label: "Profile",
        href: "/dashboard/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <MdOutlineSettings />,
        label: "Settings",
        href: "/dashboard/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <AiOutlineLogout />,
        label: "Logout",
        href: "/dashboard/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const role = "admin";

  return (
    <div className="mt-4 text-sm text-black">
      {menuItems.map((menu) => (
        <div className="flex flex-col gap-2" key={menu.title}>
          <span className="hidden lg:block text-black font-light my-4">
            {menu.title}
          </span>
          {menu.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={clsx(
                    "flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-slate-100",
                    {
                      "bg-slate-100 text-blue-600": pathname === item.href,
                    }
                  )}
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
