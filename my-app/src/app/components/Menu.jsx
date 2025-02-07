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
import { useRouter } from "next/navigation";

import { FaWpforms } from "react-icons/fa";
import { MdInsights } from "react-icons/md";

import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/app/utils/userSlice";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <FaHome />,
        label: "Home",
        href: "/dashboard",
        visible: ["admin", "superadmin", "editor","teacher", "student"],
      },
      {
        icon: <MdInsights />,
        label: "Insights",
        href: "/dashboard/insights",
        visible: ["admin", "superadmin"],
      },
      {
        icon: <HiOutlineUsers />,
        label: "Users",
        href: "/dashboard/users",
        visible: ["admin", "superadmin", "editor"],
      },
      {
        icon: <IoSchoolSharp />,
        label: "Colleges",
        href: "/dashboard/addCollege",
        visible: ["admin","editor", "superadmin"],
      },
      {
        icon: <MdOutlinePermMedia />,
        label: "Media",
        href: "/dashboard/media",
        visible: ["admin","editor", "superadmin"],
      },
      {
        icon: <GrCertificate />,
        label: "Academia",
        href: "/dashboard/academia",
        visible: ["admin","editor", "superadmin"],
      },
      {
        icon: <MdCategory />,
        label: "Category",
        href: "/dashboard/category",
        visible: ["admin","editor", "superadmin"],
      },
      {
        icon: <GrUserWorker />,
        label: "Agents",
        href: "/dashboard/agent",
        visible: ["admin", "superadmin"],
      },
   
      {
        icon: <MdEmojiEvents />,
        label: "News",
        href: "/dashboard/news",
        visible: ["admin","editor", "superadmin"],
      },
      {
        icon: <MdEmojiEvents />,
        label: "Events",
        href: "/dashboard/events",
        visible: ["admin","editor", "superadmin"],
      },
   
      
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <FaRegUserCircle />,
        label: "Update Profile",
        href: "/dashboard/profile",
        visible: ["admin","editor", "superadmin", "teacher", "student"],
      },
  
      {
        icon: <AiOutlineLogout />,
        label: "Logout",
        href: "/dashboard/logout",
        visible: ["admin","editor", "superadmin", "teacher", "student"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get the user role dynamically from Redux

  const role = useSelector((state) => {
    const roleData = state.user?.data?.role;
    return roleData ? JSON.parse(roleData) : {}; // Parse role if it's a string
  });

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      // 1. Call logout API
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/auth/logout`,
        {
          method: "POST",
          credentials: "include", // Important for cookies
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // 2. Clear cookie named "token"
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 3. Clear Redux store
      dispatch(removeUser());

      // 4. Clear localStorage
      localStorage.removeItem("refreshToken");

      // 5. Redirect to login page or home
      router.push("/sign-in"); // Adjust the path as needed
    } catch (error) {
      toast.error("Logout error:", error);
      // Handle error appropriately - maybe show a notification to user
    }
  };

  return (
    <div className="mt-4 text-sm text-black">
      {menuItems.map((menu) => (
        <div className="flex flex-col gap-2" key={menu.title}>
          <span className="hidden lg:block text-black font-light my-4">
            {menu.title}
          </span>
          {menu.items.map((item) => {
            const hasAccess = item.visible.some((r) => role[r] === true);

            if (hasAccess) {
              // Special handling for logout
              if (item.href === "/dashboard/logout") {
                return (
                  <a
                    href="#"
                    key={item.label}
                    onClick={handleLogout}
                    className={clsx(
                      "flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-slate-100",
                      {
                        "bg-slate-100 text-blue-600": pathname === item.href,
                      }
                    )}
                  >
                    {item.icon}
                    <span className="hidden lg:block">{item.label}</span>
                  </a>
                );
              }

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

  // return (
  //   <div className="mt-4 text-sm text-black">
  //     {menuItems.map((menu) => (
  //       <div className="flex flex-col gap-2" key={menu.title}>
  //         <span className="hidden lg:block text-black font-light my-4">
  //           {menu.title}
  //         </span>
  //         {menu.items.map((item) => {
  //           // Check if the user has at least one true role that matches item.visible
  //           const hasAccess = item.visible.some((r) => role[r] === true);

  //           if (hasAccess) {

  //             return (
  //               <Link
  //                 href={item.href}
  //                 key={item.label}
  //                 className={clsx(
  //                   "flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-slate-100",
  //                   {
  //                     "bg-slate-100 text-blue-600": pathname === item.href,
  //                   }
  //                 )}
  //               >
  //                 {item.icon}
  //                 <span className="hidden lg:block">{item.label}</span>
  //               </Link>
  //             );
  //           }
  //           return null;
  //         })}
  //       </div>
  //     ))}
  //   </div>

  // );
};
export default Menu;
