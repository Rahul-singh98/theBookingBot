// import React, { useState } from 'react';
// import { Bot, Headphones, Users } from 'lucide-react';

// const tabs = [
//   {
//     id: 'serv1',
//     title: 'Chat Bot',
//     icon: <Bot className="w-6 h-6" />,
//     content: 'AI-powered chatbots that provide instant customer support 24/7.',
//     link: '/chat-bot'
//   },
//   {
//     id: 'serv2',
//     title: 'Virtual Assistance',
//     icon: <Users className="w-6 h-6" />,
//     content: 'Professional virtual agents ready to handle complex customer inquiries.',
//     link: '/virtual-assistance'
//   },
//   {
//     id: 'serv3',
//     title: 'On Call Support',
//     icon: <Headphones className="w-6 h-6" />,
//     content: 'Dedicated phone support with real-time problem resolution.',
//     link: '/call-support'
//   }
// ];

// const ServiceTabs = () => {
//   const [activeTab, setActiveTab] = useState(tabs[0].id);

//   return (
//     <section className="py-24">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-[25%_75%] gap-9">
//           {/* Tab buttons */}
//           <div className="flex flex-col space-y-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center space-x-4 p-4 rounded-xl transition-colors duration-200 ${
//                   activeTab === tab.id
//                     ? 'bg-black text-[#0AFAFA]'
//                     : 'bg-gray-100 hover:bg-gray-200'
//                 }`}
//               >
//                 {tab.icon}
//                 <span className="font-medium">{tab.title}</span>
//               </button>
//             ))}
//           </div>
          
//           {/* Content panel */}
//           <div className="relative rounded-xl overflow-hidden">
//             <div className="relative p-5 h-full w-full bg-black bg-opacity-70">
//               {tabs.map((tab) => (
//                 <div
//                   key={tab.id}
//                   className={`transition-opacity duration-200 ${
//                     activeTab === tab.id ? 'block' : 'hidden'
//                   }`}
//                 >
//                   <p className="text-white mb-5">{tab.content}</p>
//                   <a
//                     href={tab.link}
//                     className="text-white font-bold hover:text-[#0AFAFA] flex justify-end"
//                   >
//                     Learn More
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServiceTabs;




















// import React, { useState } from 'react';
// import { Bot, Headphones, Users } from 'lucide-react';
// import TabContentBg from "@/assets/images/tabcontent.png";  // Updated import path

// const tabs = [
//   {
//     id: 'serv1',
//     title: 'Chat Bot',
//     icon: <Bot className="w-6 h-6" />,
//     content: 'AI-powered chatbots that provide instant customer support 24/7.',
//     link: '/chat-bot',
//   },
//   {
//     id: 'serv2',
//     title: 'Virtual Assistance',
//     icon: <Users className="w-6 h-6" />,
//     content: 'Professional virtual agents ready to handle complex customer inquiries.',
//     link: '/virtual-assistance',
//   },
//   {
//     id: 'serv3',
//     title: 'On Call Support',
//     icon: <Headphones className="w-6 h-6" />,
//     content: 'Dedicated phone support with real-time problem resolution.',
//     link: '/call-support',
//   }
// ];

// export const ServiceTabs = () => {
//   const [activeTab, setActiveTab] = useState(tabs[0].id);

//   return (
//     <div className="py-24">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-[25%_75%] gap-9">
//           {/* Tab buttons */}
//           <div className="flex flex-col space-y-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
//                   activeTab === tab.id
//                     ? 'text-[#0AFAFA]'
//                     : 'bg-gray-100 hover:bg-gray-200 text-black'
//                 }`}
//                 style={{
//                   backgroundColor: activeTab === tab.id ? '#000000' : undefined
//                 }}
//               >
//                 {tab.icon}
//                 <span className="font-medium">{tab.title}</span>
//               </button>
//             ))}
//           </div>
          
//           {/* Content panel */}
//           <div className="relative h-64 rounded-xl overflow-hidden">
//             <img 
//               src={TabContentBg} 
//               alt="Background" 
//               className="absolute inset-0 w-full h-full object-cover"
//             />
//             {tabs.map((tab) => (
//               <div
//                 key={tab.id}
//                 className={`absolute inset-0 transition-opacity duration-500 ${
//                   activeTab === tab.id ? 'opacity-100 z-10' : 'opacity-0 z-0'
//                 }`}
//               >
//                 <div className="relative p-5 h-full w-full bg-black bg-opacity-70">
//                   <p className="text-white mb-5">{tab.content}</p>
//                   <a
//                     href={tab.link}
//                     className="text-white font-bold hover:text-[#0AFAFA] flex justify-end"
//                   >
//                     Learn More
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };





import React, { useState } from 'react';
import { Bot, Headphones, Users } from 'lucide-react';
import TabContentBg from "@/assets/images/tabcontent.png";

const tabs = [
  {
    id: 'serv1',
    title: 'Chat Bot',
    icon: <Bot className="w-6 h-6" />,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sapien justo, accumsan vel viverra nec, consequat vel turpis. Phasellus cursus iaculis risus, eget varius nisl faucibus nec. Suspendisse potenti. Nam ipsum tortor, ultricies id hendrerit non, venenatis porttitor lacus. Vestibulum nibh nunc, consectetur vitae volutpat eu, ultrices et lectus. In justo justo, maximus in bibendum vel, molestie ac turpis. Etiam nulla lectus, ultrices non lectus ac, pulvinar pretium erat. Aliquam accumsan pulvinar iaculis. Sed faucibus auctor pellentesque. Phasellus laoreet, arcu nec suscipit lobortis, mauris ligula porttitor erat, ac porttitor velit nisi eget lacus. Nullam vel posuere turpis',
    link: '/chat-bot',
  },
  {
    id: 'serv2',
    title: 'Virtual Assistance',
    icon: <Users className="w-6 h-6" />,
    content: 'forem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sapien justo, accumsan vel viverra nec, consequat vel turpis. Phasellus cursus iaculis risus, eget varius nisl faucibus nec. Suspendisse potenti. Nam ipsum tortor, ultricies id hendrerit non, venenatis porttitor lacus. Vestibulum nibh nunc, consectetur vitae volutpat eu, ultrices et lectus. In justo justo, maximus in bibendum vel, molestie ac turpis. Etiam nulla lectus, ultrices non lectus ac, pulvinar pretium erat. Aliquam accumsan pulvinar iaculis. Sed faucibus auctor pellentesque. Phasellus laoreet, arcu nec suscipit lobortis, mauris ligula porttitor erat, ac porttitor velit nisi eget lacus. Nullam vel posuere turpis..',
    link: '/virtual-assistance',
  },
  {
    id: 'serv3',
    title: 'On Call Support',
    icon: <Headphones className="w-6 h-6" />,
    content: 'dorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sapien justo, accumsan vel viverra nec, consequat vel turpis. Phasellus cursus iaculis risus, eget varius nisl faucibus nec. Suspendisse potenti. Nam ipsum tortor, ultricies id hendrerit non, venenatis porttitor lacus. Vestibulum nibh nunc, consectetur vitae volutpat eu, ultrices et lectus. In justo justo, maximus in bibendum vel, molestie ac turpis. Etiam nulla lectus, ultrices non lectus ac, pulvinar pretium erat. Aliquam accumsan pulvinar iaculis. Sed faucibus auctor pellentesque. Phasellus laoreet, arcu nec suscipit lobortis, mauris ligula porttitor erat, ac porttitor velit nisi eget lacus. Nullam vel posuere turpis',
    link: '/call-support',
  }
];

const ServiceTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-[25%_75%] gap-9">
          <div className="flex flex-col space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-[#0AFAFA]'
                    : 'bg-gray-100 hover:bg-gray-200 text-black'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? '#000000' : undefined
                }}
              >
                {tab.icon}
                <span className="font-medium">{tab.title}</span>
              </button>
            ))}
          </div>

          <div className="relative h-64 rounded-xl overflow-hidden">
            <img 
              src={TabContentBg} 
              alt="Background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeTab === tab.id ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="relative p-5 h-full w-full bg-black bg-opacity-70">
                  <p className="text-white mb-5">{tab.content}</p>
                  <a
                    href={tab.link}
                    className="text-white font-bold hover:text-[#0AFAFA] flex justify-end"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export
export default ServiceTabs;
