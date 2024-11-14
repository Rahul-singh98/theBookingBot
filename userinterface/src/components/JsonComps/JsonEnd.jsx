import React from "react";

const JsonEnd = ({ targetName, onDataChange }) => {
    const [endData, setEndData] = useState({ redirect_to: '', query_params: [] });

    // Handle input changes for id, name, and redirect_to 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEndData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            onDataChange({
                "target": {
                    "name": targetName,
                    "value": updatedData
                }
            }); // Call the onDataChange function with updated data 
            return updatedData;
        });
    };

    return (
        <div className="json-end">
            <h4 className="text-lg font-semibold mb-4">Configure End</h4>
            <input type="text" name="redirect_to" value={endData.redirect_to} onChange={handleInputChange} placeholder="Redirection URL" className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" />
        </div>
    );
};

export default JsonEnd;
