import React, { useState, useEffect } from 'react';

const JsonNumber = ({ targetName, onDataChange }) => {
    const [rangeData, setRangeData] = useState({ default: 0, min: 0, max: 100, step: 1, });
    const inputClass = "w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white";

    useEffect(() => {
        onDataChange({
            "target": {
                "name": targetName,
                "value": rangeData
            }
        })
    }, [rangeData, onDataChange])

    // Handle input changes and call onDataChange with the updated data 
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = parseFloat(value) || 0; // Ensure value is a number 

        // Update the range data state 
        setRangeData((prevData) => {
            const updatedData = { ...prevData, [name]: newValue };
            onDataChange({
                "target": {
                    "name": targetName,
                    "value": updatedData
                }
            }); // Call parent function with new data 
            return updatedData;
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Default Value</label>
                <input
                    type="number" name="default"
                    value={rangeData.default}
                    onChange={handleChange}
                    className={`${inputClass}`}
                    placeholder="Enter default value (e.g., 0)" />

                <small className="text-gray-500">The initial value for this range.</small>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Value</label>
                <input
                    type="number" name="min" value={rangeData.min}
                    onChange={handleChange}
                    className={`${inputClass}`}
                    placeholder="Enter minimum value (e.g., 0)" />

                <small className="text-gray-500">The minimum allowed value.</small>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Maximum Value</label>
                <input
                    type="number" name="max" value={rangeData.max}
                    onChange={handleChange}
                    className={`${inputClass}`}
                    placeholder="Enter maximum value (e.g., 100)" />

                <small className="text-gray-500">The maximum allowed value.</small>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Step Value</label>
                <input
                    type="number" name="step" value={rangeData.step}
                    onChange={handleChange}
                    className={`${inputClass}`}
                    placeholder="Enter step value (e.g., 1)" />

                <small className="text-gray-500">The incremental step for each increase or decrease.</small>
            </div>
        </div>
    );
}; export default JsonNumber;
