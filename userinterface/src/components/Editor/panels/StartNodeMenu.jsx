import { useState, useEffect } from "react";

const StartNodeMenu = ({ data, setQuestionData }) => {
    const [description, setDescription] = useState(data.initial_data?.data?.description || '');

    // Sync state when initial_data changes
    useEffect(() => {
        if (data.initial_data?.data?.description !== description) {
            setDescription(data.initial_data?.data?.description || '');
        }
    }, [data.initial_data?.data?.description]);

    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);  // Update local state
        setQuestionData((prev) => ({
            ...prev,
            data: { ...prev.data, description: newDescription },  // Merge with existing data
        }));
    };

    return (
        <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Description:</label>
            <textarea
                value={description}  // Bind the textarea value to local state
                onChange={handleDescriptionChange}  // Update on change
                placeholder="Enter description"
                rows="3"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
        </div>
    );
};

export default StartNodeMenu;
