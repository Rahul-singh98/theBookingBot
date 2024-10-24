import React from "react";
import { Link } from "react-router-dom";
import UserFour from "@/images/user/user-04.png";

const Navbar = () => {
    return (
        <div className="w-full h-[40.96px] top-[44px] left-0 opacity-100 bg-black flex items-center justify-between px-4">
            {/* Logo Container */}
            <div className="flex items-center">
                <Link
                    className="flex items-center justify-center w-auto h-full mt-20 ml-20 pt-6"
                    to="/"
                >
                    <img
                        src={UserFour}
                        alt="Logo"
                        className="h-auto max-h-full"
                    />
                </Link>
            </div>

            {/* Navigation Links */
            }<div className="flex flex-grow justify-center gap-4 overflow-x-auto mt-20">
                {[
                    { name: "Home", path: "/" },
                    { name: "Services", path: "/services" },
                    { name: "Packages", path: "/packages" },
                    { name: "Contact Us", path: "/contact" },
                ].map((item) => (
                    <Link
                        key={item.name}
                        className="h-full flex items-center justify-center bg-black text-white font-inter text-[16px] font-bold transition duration-300 hover:font-extrabold hover:text-blue-400 hover:shadow-text-glow"
                        to={item.path}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
            
            {/* Chat Button */}
            <div className="flex items-center justify-center bg-[#F06419] rounded-l-[7px] opacity-100 mt-20 mr-50 transition duration-300 hover:bg-[#D05517]" style={{ width: '86.52px', height: '40.96px' }}>
                <span className="font-inter font-bold text-[18px] text-white" style={{ lineHeight: '21.78px' }}>
                    Chat
                </span>
            </div>
        </div>
    );
};

export default Navbar;
