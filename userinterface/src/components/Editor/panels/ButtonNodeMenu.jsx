import React, { useState } from 'react';

const ButtonNodeMenu = ({ data, setQuestionData }) => {
    const [rangeData, setRangeData] = useState({
        button_id: data?.button_id || "",
        wait_after: data?.wait_after || 0,
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
            {/* Id */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Id</label>
                <input
                    type="input"
                    name="button_id"
                    value={rangeData.button_id}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter button_id (e.g., 0)"
                />
            </div>

            {/* Wait After button Click */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Wait After button Click</label>
                <input
                    type="number"
                    name="wait_after"
                    value={rangeData.wait_after}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter wait after value "
                />
                <small className="text-gray-500">The number of seconds should wait after button click.</small>
            </div>
        </div>
    );
};

export default ButtonNodeMenu;
