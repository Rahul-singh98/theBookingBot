// import React from "react";

// const Intro = () => {
//     return (
//         <div className="relative w-[710px] h-[160px] absolute left-[52px] top-[200px]">
//             {/* Title */}
            // <div className="absolute w-[710px] h-[160px] left-0 top-0">
            //     <h1 className="font-inter font-bold text-[70px] leading-[80px] text-white">
            //         Do you want to close lorem ipsum dlr!
            //     </h1>
            // </div>

//             {/* Description */}
//             <div className="absolute w-[708px] h-[160px] left-[2px] top-[190px]">
//                 <p className="font-inter font-normal text-[28px] leading-[40px] text-white">
//                     Praesent nibh libero, mollis a mattis ac, hendrerit in dolor. In non risus at nisl vestibulum cursus quis at velit. Phasellus consectetur leo lectus. Praesent eget convallis odio In hac habitasse platea dictumst.
//                 </p>
//             </div>

//             {/* Get Started Button */}
//             <div
//                 className="flex items-center justify-center bg-[#F06419] rounded-[7px] absolute left-0 top-[394px] p-5 transition duration-300 hover:bg-[#D05517]"
//                 style={{ width: '192px', height: '64px' }}
//             >
//                 <span className="font-inter font-bold text-[20px] leading-[24px] text-white">
//                     Get started
//                 </span>
//             </div>

//         </div>
//     );
// };

// export default Intro;



// import RobotImage from "@/assets/images/robot.png"; 
// import React from "react";

// const Intro = () => {
//     return (
//         <section className="relative flex items-center justify-center bg-black text-white h-screen">
//             <div className="container mx-auto flex flex-col items-start p-20">
//                 {/* Title */}
//                 {/* <h1 className="font-inter font-bold text-[50px] leading-[60px] mb-4">
//                     Do you want to close lorem ipsum dlr!
//                 </h1> */}
//                 <div className="absolute w-[710px] h-[160px] top-0">
//                 <h1 className="font-inter font-bold text-[70px] leading-[80px] text-white">
//                     Do you want to close lorem ipsum dlr!
//                 </h1>
//             </div>                
//                 {/* Description */}
//                 <div className="absolute w-[708px] h-[160px]  top-[190px]">
//                     <p className="font-inter font-normal text-[28px] leading-[40px] text-white">
//                         Praesent nibh libero, mollis a mattis ac, hendrerit in dolor. In non risus at nisl vestibulum cursus quis at velit. Phasellus consectetur leo lectus. 
//                     </p>
//                 </div>                

//                 {/* Get Started Button */}
//                 <a 
//                     href="#"
//                     className="flex items-center justify-center bg-[#F06419] rounded-[7px] text-white font-inter font-bold text-[20px] leading-[24px] p-4 transition duration-300 hover:bg-[#D05517]"
//                     style={{ width: '192px', height: '64px' }}
//                 >
//                     Get started
//                 </a>
//             </div>

//             {/* Image */}
//             <img className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[400px] h-auto" src={RobotImage} alt="Robot" />
//         </section>
//     );
// };

// export default Intro;



import RobotImage from "@/assets/images/robot.png"; 
import React from "react";

const Intro = () => {
    return (
        <section className="relative flex items-center justify-center bg-black text-white h-screen"style={{ backgroundColor: '#000000' }}>
            <div className="container mx-auto flex flex-col items-start p-25" style={{ paddingLeft: '115px' ,height: '100%'}}> 
                {/* Title */}
                <div className="absolute w-[700px] h-[160px] top-32"> {/* Increased distance from top */}
                    <h1 className="font-inter font-bold text-[70px] leading-[80px] text-white">
                        Do you want to close lorem ipsum dlr!
                    </h1>
                </div>                
                {/* Description */}
                <div className="absolute w-[700px] h-[160px] top-[315px]"> {/* Adjusted top value */}
                    <p className="font-inter font-normal text-[28px] leading-[40px] text-white">
                        Praesent nibh libero, mollis a mattis ac, hendrerit in dolor. In non risus at nisl vestibulum cursus quis at velit. Phasellus consectetur leo lectus.  Phasellus consectetur leo lectus. 
                    </p>
                </div>                

                {/* Get Started Button */}
                <a 
                    href="#"
                    className="absolute bg-[#F06419] rounded-[7px] text-white font-inter font-bold text-[20px] leading-[24px] p-4 transition duration-300 hover:bg-[#D05517] flex items-center justify-center"
                    style={{ width: '192px', height: '64px', top: '490px' }} 
                >
                    Get started
                </a>
                
            </div>

            {/* Image */}
            <img className="absolute right-0 top-100 transform -translate-y-1/2 w-[730px] h-[800px]" src={RobotImage} alt="Robot" /> 
        </section>
    );
};

export default Intro;



