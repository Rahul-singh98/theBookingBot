import React, { useState } from "react";
import SimpleModal from "@/components/Modal/SimpleModal";

const PublishChatbotNode = ({ chatbotId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <button
                onClick={openModal}
                className="px-4 py-2 rounded hover:bg-blue-700 hover:text-white border"
            >
                Publish
            </button>

            <SimpleModal isOpen={isOpen} onClose={closeModal} title="Embedded Script">
                <pre className="p-4 bg-gray-100 text-gray-800 rounded overflow-auto">
                    {`<script
  src="http://localhost:8001/static/js/embed.min.js"
  onload="initChatbot({token:'${chatbotId}', backendUrl: 'http://localhost:8001'})"
  defer
></script>`}
                </pre>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </SimpleModal>
        </div>
    );
};

export default PublishChatbotNode;
