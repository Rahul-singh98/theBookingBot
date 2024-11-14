import React, { useState } from "react";

const JsonClickList = ({ targetName, onDataChange }) => {
    const [clickListData, setClickListData] = useState({ options: [], });
    const [newOption, setNewOption] = useState({ id: '', text: '', value: '' });

    // Handle input changes for id, name, and options 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClickListData((prevData) => {
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

    // Handle changes for new option fields 
    const handleOptionChange = (e) => {
        const { name, value } = e.target;
        setNewOption((prevOption) => ({ ...prevOption, [name]: value }));
    };

    // Add new option to options list 
    const addOption = () => {
        if (newOption.id && newOption.value && newOption.text) {
            const updatedOptions = [...clickListData.options, newOption];
            const updatedData = { ...clickListData, options: updatedOptions };
            setClickListData(updatedData); // Update clickListData state 
            onDataChange({
                "target": {
                    "name": targetName,
                    "value": updatedData
                }
            }); // Call the onDataChange function with updated data 
            setNewOption({ id: '', text: '', value: '' }); // Reset the new option fields 
        }
    };

    // Remove option by index 
    const removeOption = (index) => {
        const updatedOptions = clickListData.options.filter((_, i) => i !== index);
        const updatedData = { ...clickListData, options: updatedOptions };
        setClickListData(updatedData); // Update clickListData state 
        onDataChange({
            "target": {
                "name": targetName,
                "value": updatedData
            }
        }); // Call the onDataChange function with updated data 
    };

    return (
        <div className="json-clickList">
            <h4 className="text-lg font-semibold mb-4">Configure ClickList</h4>

            {/* Options List */}
            <h4 className="font-medium mb-2">Options:</h4>
            <ul className="options-list mb-4">
                {clickListData.options.map((option, index) => (
                    <li key={index} className="flex items-center gap-2 mb-2">
                        <span className="flex-1"> <strong>Value:</strong> {option.value} | <strong>Text:</strong> {option.text} </span>
                        <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700 text-sm" > Remove </button> </li>))}
            </ul>

            {/* Add New Option */}
            <div className="flex gap-2 mb-4">
                <input type="text" name="id" value={newOption.id} onChange={handleOptionChange} placeholder="Option id" className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" />
                <input type="text" name="value" value={newOption.value} onChange={handleOptionChange} placeholder="Option Value" className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" />
                <input type="text" name="text" value={newOption.htmlText} onChange={handleOptionChange} placeholder="Option Text" className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" />
                <button type="button" onClick={addOption} className="bg-blue-500 text-white px-3 py-1 rounded-md" > Add Option </button>
            </div>
        </div>
    );
};

export default JsonClickList;
