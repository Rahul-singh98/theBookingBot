import React, { useState, useEffect } from 'react';
import { dateFormatOptions } from '@/utils/datetime_formats';

const JsonDate = ({ targetName, onDataChange }) => {
    const [dateData, setDateData] = useState({ format: "%m/%d/%Y" });

    useEffect(() => {
        onDataChange({
            "target": {
                "name": targetName,
                "value": dateData
            }
        })
    }, [dateData, onDataChange])

    // Handle the format dropdown change 
    const handleFormatChange = (e) => {
        const newFormat = e.target.value;
        const updatedData = { ...dateData, format: newFormat };
        setDateData(updatedData);
        onDataChange({
            "target": {
                "name": targetName,
                "value": updatedData
            }
        });
    };

    return (
        <div className="date-component">
            <h3 className="text-lg font-semibold mb-4">Select Date Format</h3>
            <div className="mb-4">
                <label className="block font-medium mb-2">Format:</label>
                <select value={dateData.format} onChange={handleFormatChange} className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" >
                    {dateFormatOptions.map((option) => (<option key={option.value} value={option.value}> {option.label} </option>))}
                </select>
            </div>
        </div>
    );
};

export default JsonDate;
