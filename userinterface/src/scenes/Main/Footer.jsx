// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaTwitter, FaInstagram, FaDribbble, FaYoutube, FaPaperPlane } from 'react-icons/fa';
// import UserFour from "@/images/user/user-04.png";

// const Footer = () => {
//     return (
//         <div className="fixed bottom-0 w-full bg-[#263238] flex p-8" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
//             {/* Left Section: Logo, Copyright, Social Links */}
//             <div className="flex flex-col justify-between" style={{ width: '40%', height: '200px' }}>
//                 {/* Logo Section */}
//                 <div className="flex items-center mb-6">
//                     <img
//                         src={UserFour}
//                         alt="Logo"
//                         className="mr-4 pl-20"
//                         style={{
//                             width: '217px',
//                             height: '63px',
//                         }}
//                     />
//                 </div>
//                 {/* Copyright Section */}
//                 <div className="flex flex-col items-start gap-1 opacity-100">
//                     <div className="text-white text-[14px]">Copyright © 2024 ChatBOT Ltd.</div>
//                     <div className="text-[#F5F7FA] text-[14px]">All rights reserved</div>
//                 </div>
             
//                 {/* Social Links */}
//                 <div className="flex flex-row items-center gap-6 mt-4">
//                     <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
//                         <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center transition-colors duration-300 hover:bg-[#F5F7FA]">
//                             <FaTwitter className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
//                         </div>
//                     </a>
//                     <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
//                         <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center transition-colors duration-300 hover:bg-[#F5F7FA]">
//                         <FaInstagram className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
//                         </div>
//                     </a>
//                     <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">
//                         <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center transition-colors duration-300 hover:bg-[#F5F7FA]">
//                         <FaDribbble className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
//                         </div>
//                     </a>
//                     <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
//                         <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center transition-colors duration-300 hover:bg-[#F5F7FA]">
//                         <FaYoutube className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
//                         </div>
//                     </a>
//                 </div>

//             </div>

//             {/* Right Section: Links */}
//             <div className="flex justify-between ml-auto" style={{ width: '60%', height: '200px' }}>
//                 {/* Column 1 */}
//                 <div className="flex flex-col items-start gap-3">
//                     <h4 className="font-inter font-semibold text-[20px] text-white">Company</h4>
//                     <Link to="/about" className="w-40 h-5 text-[14px] text-[#F5F7FA]">About Us</Link>
//                     <Link to="/blog" className="w-40 h-5 text-[14px] text-[#F5F7FA]">Blog</Link>
//                     <Link to="/contact" className="w-40 h-5 text-[14px] text-[#F5F7FA]">Contact Us</Link>
//                 </div>

//                 {/* Column 2: Support */}
//                 <div className="flex flex-col items-start gap-3">
//                     <h4 className="font-inter font-semibold text-white text-[20px] leading-[28px]">Support</h4>
//                     <Link to="/help-center" className="text-[#F5F7FA] text-[14px] leading-[20px]">Help Center</Link>
//                     <Link to="/terms" className="text-[#F5F7FA] text-[14px] leading-[20px]">Terms of Service</Link>
//                     <Link to="/privacy" className="text-[#F5F7FA] text-[14px] leading-[20px]">Privacy Policy</Link>
//                 </div>

//                 {/* Column 3: Stay Updated */}
//                 <div className="flex flex-col items-start gap-6">
//                     <h4 className="font-inter font-semibold text-white text-[20px] leading-[28px]">Stay Updated</h4>
//                     <div className="flex items-center">
//                         <input
//                             type="email"
//                             placeholder="Your email address"
//                             className="w-[255px] h-[40px] bg-white opacity-20 rounded-l-md p-2 placeholder-opacity-70"
//                             style={{ outline: 'none' }}
//                         />
//                         <button className="w-10 h-[40px] bg-[#263238] rounded-r-md flex items-center justify-center transition-colors duration-300 hover:bg-[#1C1F22]">
//                             <FaPaperPlane className="text-white text-lg" />
//                         </button>
//                     </div>
//                 </div>



//             </div>
//         </div>
//     );
// };

// export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaDribbble, FaYoutube, FaPaperPlane } from 'react-icons/fa';
import UserFour from "@/images/user/user-04.png";
import FooterLogo from "@/assets/images/footer-logo.png";


const Footer = () => {
    return (
        <div className="w-full bg-[#263238] flex p-8" style={{ paddingLeft: '120px', paddingRight: '120px' ,backgroundColor: '#000000'}}>
            {/* Left Section: Logo, Copyright, Social Links */}
            <div className="flex flex-col justify-between" style={{ width: '40%', height: '200px' }}>
                {/* Logo Section */}
                <div className="flex items-center mb-6">
                    <img
                        src={FooterLogo}
                        alt="Logo"
                        className="mr-4 pl-20"
                        style={{
                            width: '217px',
                            height: '63px',
                        }}
                    />
                </div>
                {/* Copyright Section */}
                <div className="flex flex-col items-start gap-1 opacity-100" style={{ paddingLeft: '80px', paddingRight: '120px' }}>
                    <div className="text-white text-[14px]">Copyright © 2024 ChatBOT Ltd.</div>
                    <div className="text-[#F5F7FA] text-[14px]">All rights reserved</div>
                </div>
             
                {/* Social Links */}
                <div className="flex flex-row items-center gap-6 mt-4" style={{ paddingLeft: '80px', paddingRight: '120px' }}>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center transition-colors duration-300 hover:bg-[#F5F7FA]">
                            <FaTwitter className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
                        </div>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center transition-colors duration-300 hover:bg-[#F5F7FA]">
                        <FaInstagram className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
                        </div>
                    </a>
                    <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">
                        <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center transition-colors duration-300 hover:bg-[#F5F7FA]">
                        <FaDribbble className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
                        </div>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center transition-colors duration-300 hover:bg-[#F5F7FA]">
                        <FaYoutube className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
                        </div>
                    </a>
                </div>
            </div>

            {/* Right Section: Links */}
            <div className="flex justify-between ml-auto" style={{ width: '60%', height: '200px' }}>
                {/* Column 1 */}
                <div className="flex flex-col items-start gap-3">
                    <h4 className="font-inter font-semibold text-[20px] text-white">Company</h4>
                    <Link to="/about" className="w-40 h-5 text-[14px] text-[#F5F7FA]">About Us</Link>
                    <Link to="/blog" className="w-40 h-5 text-[14px] text-[#F5F7FA]">Blog</Link>
                    <Link to="/contact" className="w-40 h-5 text-[14px] text-[#F5F7FA]">Contact Us</Link>
                </div>

                {/* Column 2: Support */}
                <div className="flex flex-col items-start gap-3">
                    <h4 className="font-inter font-semibold text-white text-[20px] leading-[28px]">Support</h4>
                    <Link to="/help-center" className="text-[#F5F7FA] text-[14px] leading-[20px]">Help Center</Link>
                    <Link to="/terms" className="text-[#F5F7FA] text-[14px] leading-[20px]">Terms of Service</Link>
                    <Link to="/privacy" className="text-[#F5F7FA] text-[14px] leading-[20px]">Privacy Policy</Link>
                </div>

                {/* Column 3: Stay Updated */}
                {/* <div className="flex flex-col items-start gap-6">
                    <h4 className="font-inter font-semibold text-white text-[20px] leading-[28px]">Stay Updated</h4>
                    <div className="flex items-center">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-[255px] h-[40px] bg-white opacity-20 rounded-l-md p-2 placeholder-opacity-70"
                            style={{ outline: 'none' }}
                        />
                        <button className="w-10 h-[40px] bg-[#263238] rounded-r-md flex items-center justify-center transition-colors duration-300 hover:bg-[#1C1F22]">
                            <FaPaperPlane className="text-white text-lg" />
                        </button>
                    </div>
                </div> */}
                <div className="flex flex-col items-start gap-6">
                    <h4 className="font-inter font-semibold text-white text-[20px] leading-[28px]">Stay Updated</h4>
                    <div className="flex items-center bg-white rounded-md overflow-hidden"> {/* Added bg-white and rounded-md */}
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-[255px] h-[40px] bg-transparent opacity-100 rounded-l-md p-2 placeholder-opacity-70" // Changed bg to transparent for input
                            style={{ outline: 'none' }}
                        />
                        <button className="w-10 h-[40px] bg-[#ffffff] rounded-r-md flex items-center justify-center transition-colors duration-300 hover:bg-[#1C1F22]">
                            <FaPaperPlane className="text-black text-lg" /> {/* Changed text color to black */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;

