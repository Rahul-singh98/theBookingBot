import React from "react";

const Intro = () => {
    return (
        <div className="relative w-[710px] h-[160px] absolute left-[52px] top-[200px]">
            {/* Title */}
            <div className="absolute w-[710px] h-[160px] left-0 top-0">
                <h1 className="font-inter font-bold text-[70px] leading-[80px] text-white">
                    Do you want to close lorem ipsum dlr!
                </h1>
            </div>

            {/* Description */}
            <div className="absolute w-[708px] h-[160px] left-[2px] top-[190px]">
                <p className="font-inter font-normal text-[28px] leading-[40px] text-white">
                    Praesent nibh libero, mollis a mattis ac, hendrerit in dolor. In non risus at nisl vestibulum cursus quis at velit. Phasellus consectetur leo lectus. Praesent eget convallis odio In hac habitasse platea dictumst.
                </p>
            </div>

            {/* Get Started Button */}
            <div
                className="flex items-center justify-center bg-[#F06419] rounded-[7px] absolute left-0 top-[394px] p-5 transition duration-300 hover:bg-[#D05517]"
                style={{ width: '192px', height: '64px' }}
            >
                <span className="font-inter font-bold text-[20px] leading-[24px] text-white">
                    Get started
                </span>
            </div>

        </div>
    );
};

export default Intro;
