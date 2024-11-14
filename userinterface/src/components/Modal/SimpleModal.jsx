import React from 'react'
import {
  X,
} from "lucide-react";


// Modal component
const SimpleModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative z-50 bg-white dark:bg-boxdark rounded-lg shadow-lg w-full max-w-screen-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-strokedark">
          <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-full"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-15rem)]">{children}</div>
      </div>
    </div>
  );
};

export default SimpleModal