import React from "react";
import { Link } from "react-router-dom";
import UserFour from "@/images/user/user-04.png";
import LogoImage from "@/assets/images/logo.png";

const Navbar = () => {
  return (
    <nav
      className="nav-section bg-black "
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container mx-auto">
        <div className="nav-wrap flex items-center justify-between py-4">
          {/* Logo Container */}
          <Link
            className="logo flex items-center h-[70px] w-auto"
            style={{ paddingLeft: "115px" }}
            to="/"
          >
            <img src={LogoImage} alt="Logo" className="h-auto max-h-full" />
          </Link>

          {/* Navigation Links */}
          <ul className="flex items-center gap-20 style={{ width: '455px' }}">
            <li>
              <Link
                className="text-white font-bold transition duration-300 hover:underline"
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-white font-bold transition duration-300 hover:underline"
                to="/services"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                className="text-white font-bold transition duration-300 hover:underline"
                to="/packages"
              >
                Packages
              </Link>
            </li>
            <li>
              <Link
                className="text-white font-bold transition duration-300 hover:underline"
                to="/contact"
              >
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Chat Button */}
          <div className="chat-cta">
            <Link
              className="flex items-center justify-center bg-[#F06419] rounded-md text-white font-bold text-[18px] py-2 px-4 transition duration-300 hover:bg-[#D05517]"
              to="#"
            >
              Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
