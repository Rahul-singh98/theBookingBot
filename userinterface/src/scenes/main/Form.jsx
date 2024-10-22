
import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaInstagram } from "react-icons/fa";


// import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaInstagram } from "react-icons/fa";

const Form = () => {
    const [focusedField, setFocusedField] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    return (
        <div className="relative w-screen h-screen bg-[#F06419] flex items-center justify-center">
            {/* Group 1000001764 */}
            <div
                className="absolute"
                style={{
                    width: '438px',
                    height: '92px',
                    left: '50%', // Center horizontally
                    transform: 'translateX(-50%)', // Adjust for half the width
                    top: '120px' // Adjusted top value
                }}
            />

            {/* Contact Us */}
            <div
                className="absolute"
                style={{
                    width: '219px',
                    height: '48px',
                    left: '50%', // Center horizontally
                    transform: 'translateX(-50%)', // Adjust for half the width
                    top: '85px', // Adjusted top value
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '40px',
                    lineHeight: '48px',
                    color: '#FFFFFF',
                }}
            >
                Contact Us
            </div>

            {/* Message Prompt */}
            <div
                className="absolute"
                style={{
                    width: '438px',
                    height: '22px',
                    left: '50%', // Center horizontally
                    transform: 'translateX(-50%)', // Adjust for half the width
                    top: '150px', // Adjusted top value
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '22px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                }}
            >
                Any question or remarks? Just write us a message!
            </div>

            {/* Container 3 */}
            <div
                className="relative w-[1270px] h-[670px] bg-white rounded-[10px] opacity-100 flex items-center justify-center shadow-[0px_0px_60px_30px_rgba(0,0,0,0.08)]"
                style={{ padding: '20px', transform: 'translateX(20px)', top: '100px', left: '0' }}
            >
                {/* Container 2 */}
                <div
                    className="absolute w-[491px] h-[580px] bg-black rounded-lg flex flex-col transition-transform duration-300 overflow-hidden"
                    style={{ transform: 'translateX(20px)', top: '50px', left: '0' }} // Adjusted height and top position
                >
                    {/* Contact Information */}
                    <h2 className="absolute w-[291px] h-[42px] left-[40px] top-[30px] font-poppins font-semibold text-[28px] leading-[42px] text-white">
                        Contact Information
                    </h2>

                    {/* Chat Prompt */}
                    <p className="absolute w-[307px] h-[27px] left-[40px] top-[80px] font-poppins font-normal text-[18px] leading-[27px] text-[#C9C9C9]">
                        Say something to start a live chat!
                    </p>

                    {/* Phone Number */}
                    <div className="absolute w-[167px] h-[24px] left-[40px] top-[180px] flex items-center">
                        <FaPhoneAlt className="text-white w-[24px] h-[24px]" />
                        <span className="ml-[10px] font-poppins font-normal text-[16px] leading-[24px] text-white">
                            +1012 3456 789
                        </span>
                    </div>

                    {/* Email Address */}
                    <div className="absolute w-[199px] h-[24px] left-[40px] top-[250px] flex items-center">
                        <FaEnvelope className="text-white w-[24px] h-[24px]" />
                        <span className="ml-[10px] font-poppins font-normal text-[16px] leading-[24px] text-white">
                            demo@gmail.com
                        </span>
                    </div>

                    {/* Address with Location Icon */}
                    <div className="absolute flex items-center left-[40px] top-[330px]">
                        <FaMapMarkerAlt className="text-white w-[24px] h-[24px]" />
                        <p className="ml-[10px] w-[218px] h-[48px] font-poppins font-normal text-[16px] leading-[24px] text-white">
                            132 lorem ipsum Street 7th Nyc, 01123 United States
                        </p>
                    </div>

                    {/* Social Icons */}
                    <div className="absolute flex left-[39px] top-[530px]">
                        {/* Twitter Icon */}
                        <div className="w-[30px] h-[30px] bg-[#1B1B1B] rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-white">
                            <FaTwitter className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
                        </div>

                        {/* Instagram Icon */}
                        <div className="w-[30px] h-[30px] bg-[#1B1B1B] rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-white ml-[10px]">
                            <FaInstagram className="text-white w-[20px] h-[20px] transition-colors duration-300 hover:text-[#1B1B1B]" />
                        </div>
                    </div>

                    {/* Ellipses */}
                    <div className="absolute" style={{ left: '311px', top: '420px', width: '269px', height: '300px', background: 'rgba(72, 72, 72, 0.5)', borderRadius: '50%' }}></div>
                    <div className="absolute" style={{ left: '283px', top: '400px', width: '138px', height: '150px', background: 'rgba(72, 72, 72, 0.5)', borderRadius: '50%' }}></div>
                </div>
                {/* New Fields */}
                <div className="absolute" style={{ left: '668px', top: '100px' }}>
                    {/* First Name Field */}
                    <label
                        className={`block font-poppins text-[12px] mb-[5px] ${focusedField === 'firstName' ? 'font-bold' : 'text-[#8D8D8D]'}`}
                        htmlFor="firstName">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        className={`w-[278px] h-[20px] border-b outline-none p-1 transition-all duration-300 
                            ${focusedField === 'firstName' ? 'font-bold border-b-2 border-black' : 'border-b border-[#8D8D8D]'}`}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField('')}
                    />
                </div>

                <div className="absolute" style={{ left: '980px', top: '100px' }}>
                    {/* Last Name Field */}
                    <label
                        className={`block font-poppins text-[12px] mb-[5px] ${focusedField === 'lastName' ? 'font-bold' : 'text-[#8D8D8D]'}`}
                        htmlFor="lastName">
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        className={`w-[278px] h-[20px] border-b outline-none p-1 transition-all duration-300 
                            ${focusedField === 'lastName' ? 'font-bold border-b-2 border-black' : 'border-b border-[#8D8D8D]'}`}
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField('')}
                    />
                </div>

                <div className="absolute" style={{ left: '668px', top: '165px' }}>
                    {/* Email Field */}
                    <label
                        className={`block font-poppins text-[12px] mb-[5px] ${focusedField === 'email' ? 'font-bold' : 'text-[#8D8D8D]'}`}
                        htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="text"
                        className={`w-[278px] h-[20px] border-b outline-none p-1 transition-all duration-300 
                            ${focusedField === 'email' ? 'font-bold border-b-2 border-black' : 'border-b border-[#8D8D8D]'}`}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                    />
                </div>

                <div className="absolute" style={{ left: '980px', top: '165px' }}>
                    {/* Phone Number Field */}
                    <label
                        className={`block font-poppins text-[12px] mb-[5px] ${focusedField === 'phoneNumber' ? 'font-bold' : 'text-[#8D8D8D]'}`}
                        htmlFor="phoneNumber">
                        Phone Number
                    </label>
                    <input
                        id="phoneNumber"
                        type="text"
                        className={`w-[278px] h-[20px] border-b outline-none p-1 transition-all duration-300 
                            ${focusedField === 'phoneNumber' ? 'font-bold border-b-2 border-black' : 'border-b border-[#8D8D8D]'}`}
                        onFocus={() => setFocusedField('phoneNumber')}
                        onBlur={() => setFocusedField('')}
                    />
                </div>

                {/* Select Subject Field */}
                <div className="absolute" style={{ left: '668px', top: '260px' }}>
                    <label className="block font-poppins font-semibold text-[14px] mb-[5px] text-black">
                        Select Subject
                    </label>
                    <div className="flex">
                        {['General Inquiry', 'General Inquiry1', 'General Inquiry2', 'General Inquiry3'].map((subject, index) => (
                            <div className="flex items-center mr-4 relative" key={index}>
                                <input
                                    type="radio"
                                    id={subject}
                                    name="subject"
                                    className="appearance-none h-4 w-4 border rounded-full border-[#8D8D8D] cursor-pointer"
                                    checked={selectedSubject === subject}
                                    onChange={() => setSelectedSubject(subject)}
                                />
                                <div
                                    className={`absolute left-0 top-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300 ${selectedSubject === subject ? 'bg-black' : 'bg-transparent'}`}
                                >
                                    {selectedSubject === subject && (
                                        <span className="text-white text-[12px]">&#10003;</span>
                                    )}
                                </div>
                                <label
                                    htmlFor={subject}
                                    className={`font-poppins font-normal text-[12px] ${selectedSubject === subject ? 'font-bold' : 'text-[#8D8D8D]'}`}>
                                    {subject}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Input Area */}
                <div className="absolute" style={{ left: '668px', top: '350px' }}> {/* Adjust top value as needed */}
                    <label className="block font-poppins font-medium text-[12px] text-[#8D8D8D] mb-[5px]">
                        Message
                    </label>
                    <input
                        type="text"
                        placeholder="Write your message.."
                        className="border border-transparent rounded-md w-[595px] h-[56px] p-2 pl-0 focus:outline-none" // Removed border styling
                    />

                    <div
                        className="absolute w-[595px] h-[1px] bg-[#8D8D8D]"
                        style={{ top: '65px', left: '0' }} // Adjust top value for the underline
                    />
                </div>

                {/* Button */}
                <div
                    className="flex items-center justify-center bg-[#F06419] rounded-[5px] shadow-[0px_0px_14px_0px_rgba(0,0,0,0.12)] transition duration-300 hover:bg-[#D05517] absolute"
                    style={{
                        width: '214px',
                        height: '54px',
                        top: '500px', // Adjust this value
                        left: '1030px', // Adjust this value
                        padding: '15px 48px',
                        zIndex: 10, // Ensure it's above other elements
                    }}
                >
                    <span
                        className="font-poppins text-white text-[16px] font-medium leading-[24px] text-center"
                        style={{
                            opacity: '1', // Ensure visibility
                        }}
                    >
                        Send Message
                    </span>
                </div>
                


            </div>

        </div>
    );
};


export default Form;

