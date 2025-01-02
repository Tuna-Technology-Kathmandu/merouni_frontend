// import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdEmojiEvents } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { IoSchoolSharp } from "react-icons/io5";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <FaHome />        ,
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <IoSchoolSharp/>,
        label: "Colleges",
        href: "/colleges",
        visible: ["admin", "teacher"],
      },
     
      {
        icon: <GrUserWorker/>,
        label: "Agents",
        href: "/agents",
        visible: ["admin", "teacher"],
      },
     
     
    
    
      {
        icon: <HiOutlineDocumentReport/>,
        label: "Results",
        href: "/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
     
      {
        icon: <MdEmojiEvents/>,
        label: "Events",
        href: "/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      
      {
        icon: <TfiAnnouncement/>,
        label: "Announcements",
        href: "/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <FaRegUserCircle/>,
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <MdOutlineSettings/>,
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <AiOutlineLogout/>,
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = async () => {
//   const user = await currentUser();
//   const role = user?.publicMetadata.role;
const role="admin"

  return (
    <div className="mt-4 text-sm text-black">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-black font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight hover:bg-slate-100"
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null; // In case role does not match, return null
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
