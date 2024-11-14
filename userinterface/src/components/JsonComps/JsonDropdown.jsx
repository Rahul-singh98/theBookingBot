import React, { useState, useEffect } from 'react';

// JsonDropdown component 
const JsonDropdown = ({ targetName, onDataChange, initialData }) => {
    console.log("Dropdown", initialData)
    const [dropdownData, setDropdownData] = useState({ id: '', name: '', options: [], });
    const [newOption, setNewOption] = useState({ value: '', htmlText: '' });

    useEffect(() => {
        if (initialData && initialData !== "{}") {
            setDropdownData(initialData);
        }
    }, [initialData]);

    // Handle input changes for id, name, and options 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDropdownData((prevData) => {
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
        if (newOption.value && newOption.htmlText) {
            const updatedOptions = [...dropdownData.options, newOption];
            const updatedData = { ...dropdownData, options: updatedOptions };
            setDropdownData(updatedData); // Update dropdownData state 
            onDataChange({
                "target": {
                    "name": targetName,
                    "value": updatedData
                }
            }); // Call the onDataChange function with updated data 
            setNewOption({ value: '', htmlText: '' }); // Reset the new option fields 
        }
    };

    // Remove option by index 
    const removeOption = (index) => {
        const updatedOptions = dropdownData.options.filter((_, i) => i !== index);
        const updatedData = { ...dropdownData, options: updatedOptions };
        setDropdownData(updatedData); // Update dropdownData state 
        onDataChange({
            "target": {
                "name": targetName,
                "value": updatedData
            }
        }); // Call the onDataChange function with updated data 
    };

    return (
        <div className="json-dropdown">
            <h4 className="text-lg font-semibold mb-4">Configure Dropdown</h4>

            {/* ID and Name Inputs */}
            <div className="mb-4">
                <label className="block font-medium">ID:</label>
                <input type="text" name="id" value={dropdownData.id} onChange={handleInputChange} placeholder="Enter ID" className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" />
            </div>

            <div className="mb-4">
                <label className="block font-medium">Name:</label>
                <input type="text" name="name" value={dropdownData.name} onChange={handleInputChange} placeholder="Enter Name" className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" />
            </div>

            {/* Options List */}
            <h4 className="font-medium mb-2">Options:</h4>
            <ul className="options-list mb-4">
                {dropdownData.options.map((option, index) => (
                    <li key={index} className="flex items-center gap-2 mb-2">
                        <span className="flex-1"> <strong>Value:</strong> {option.value} | <strong>Text:</strong> {option.htmlText} </span>
                        <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700 text-sm" > Remove </button> </li>))}
            </ul>

            {/* Add New Option */}
            <div className="flex gap-2 mb-4">
                <input type="text" name="value" value={newOption.value} onChange={handleOptionChange} placeholder="Option Value" className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" />
                <input type="text" name="htmlText" value={newOption.htmlText} onChange={handleOptionChange} placeholder="Option Text" className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" />
                <button type="button" onClick={addOption} className="bg-blue-500 text-white px-3 py-1 rounded-md" > Add Option </button>
            </div>
        </div>
    );
};

export default JsonDropdown;
