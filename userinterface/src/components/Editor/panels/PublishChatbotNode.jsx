import React from "react";

const PublishChatbotNode = ({ chatbotId, readyToPublish }) => {
    // When Publish is clicked, redirect to current path with ?token=chatbotId
    const openPublish = () => {
        const is_ready = readyToPublish();
        if (is_ready === true) {
            // Open the base origin URL with token query param in a new tab
            const url = `${window.location.origin}/?token=${encodeURIComponent(chatbotId)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <button
                onClick={openPublish}
                className="px-4 py-2 rounded hover:bg-blue-700 hover:text-white border"
            >
                Publish
            </button>
        </div>
    );
};

export default PublishChatbotNode;
