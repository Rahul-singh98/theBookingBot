import React, { useState } from 'react';

const NumberNodeMenu = ({ data, setQuestionData }) => {
    const [rangeData, setRangeData] = useState({
        default: data?.default || 0,
        min: data?.min || 0,
        max: data?.max || 100,
        step: data?.step || 1,
    });

    const inputClass = "w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white";

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedRangeData = { ...rangeData, [name]: value };
        setRangeData(updatedRangeData);

        // Call setQuestionData to notify the parent component
        setQuestionData((prev) => ({
            ...prev,
            data: { ...prev.data, ...updatedRangeData },
        }));
    };

    return (
        <div className="max-h-[400px] overflow-y-auto space-y-4">
            {/* Default Value */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Default Value</label>
                <input
                    type="number"
                    name="default"
                    value={rangeData.default}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter default value (e.g., 0)"
                />
                <small className="text-gray-500">The initial value for this range.</small>
            </div>

            {/* Minimum Value */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Value</label>
                <input
                    type="number"
                    name="min"
                    value={rangeData.min}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter minimum value (e.g., 0)"
                />
                <small className="text-gray-500">The minimum allowed value.</small>
            </div>

            {/* Maximum Value */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Maximum Value</label>
                <input
                    type="number"
                    name="max"
                    value={rangeData.max}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter maximum value (e.g., 100)"
                />
                <small className="text-gray-500">The maximum allowed value.</small>
            </div>

            {/* Step Value */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Step Value</label>
                <input
                    type="number"
                    name="step"
                    value={rangeData.step}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter step value (e.g., 1)"
                />
                <small className="text-gray-500">The incremental step for each increase or decrease.</small>
            </div>
        </div>
    );
};

export default NumberNodeMenu;
