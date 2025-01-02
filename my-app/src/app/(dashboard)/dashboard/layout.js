import AdminNavbar from "@/app/components/AdminNavbar";
import Menu from "@/app/components/Menu";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex text-black">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <img
            src="/images/edusanjal-logo.svg"
            alt="logo"
            width={100}
          />
          <span className="hidden lg:block font-bold">My UNI</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <AdminNavbar />
        {children}
      </div>
    </div>
  );
}
