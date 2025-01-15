import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
    

      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src={"/images/logo.png"}
                width={200}
                height={200}
                alt="Mero UNI logo"
              />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link  href={"/"}>Home</Link>
              <Link href={"/events"}>Events</Link>
              <Link href={"/blogs"}>Blogs</Link>
              <Link href={"/contact"}>Contact</Link>
              <Link href={"/about"}>About Us</Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Footer;
