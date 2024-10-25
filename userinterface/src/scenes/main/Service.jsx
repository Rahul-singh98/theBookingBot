import React, { useState } from 'react';
import { Bot, Headphones, Users } from 'lucide-react';

const tabs = [
  {
    id: 'serv1',
    title: 'Chat Bot',
    icon: <Bot className="w-6 h-6" />,
    content: 'AI-powered chatbots that provide instant customer support 24/7.',
    link: '/chat-bot'
  },
  {
    id: 'serv2',
    title: 'Virtual Assistance',
    icon: <Users className="w-6 h-6" />,
    content: 'Professional virtual agents ready to handle complex customer inquiries.',
    link: '/virtual-assistance'
  },
  {
    id: 'serv3',
    title: 'On Call Support',
    icon: <Headphones className="w-6 h-6" />,
    content: 'Dedicated phone support with real-time problem resolution.',
    link: '/call-support'
  }
];

const ServiceTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-[25%_75%] gap-9">
          {/* Tab buttons */}
          <div className="flex flex-col space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-black text-[#0AFAFA]'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.title}</span>
              </button>
            ))}
          </div>
          
          {/* Content panel */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="relative p-5 h-full w-full bg-black bg-opacity-70">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`transition-opacity duration-200 ${
                    activeTab === tab.id ? 'block' : 'hidden'
                  }`}
                >
                  <p className="text-white mb-5">{tab.content}</p>
                  <a
                    href={tab.link}
                    className="text-white font-bold hover:text-[#0AFAFA] flex justify-end"
                  >
                    Learn More
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTabs;

