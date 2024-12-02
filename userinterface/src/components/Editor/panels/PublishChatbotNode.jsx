import React, { useState } from "react";
import SimpleModal from "@/components/Modal/SimpleModal";

const PublishChatbotNode = ({ chatbotId, readyToPublish }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        const is_ready = readyToPublish()
        if (is_ready === true) {
            setIsOpen(true)
        }
    };
    const closeModal = () => setIsOpen(false);

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <button
                onClick={openModal}
                className="px-4 py-2 rounded hover:bg-blue-700 hover:text-white border"
            >
                Publish
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-bottom justify-left bg-black bg-opacity-50 w-100">
                    <div className="bg-white dark:bg-boxdark  w-11/12 max-w-md rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Embedded Script</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <div className="mt-4">
                            <pre className="p-4 bg-gray-100 text-gray-800 rounded overflow-auto">
                                {`<script
  src="http://localhost:8001/static/js/embed.min.js"
  onload="initChatbot({token:'${chatbotId}', backendUrl: 'http://localhost:8001'})"
  defer
></script>`}
                            </pre>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublishChatbotNode;
