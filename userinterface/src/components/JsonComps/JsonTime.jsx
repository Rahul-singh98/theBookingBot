import React, { useState, useEffect } from 'react';
import { timeFormatOptions } from '@/utils/datetime_formats';


const JsonTime = ({ targetName, onDataChange }) => {
    const [timeData, setTimeData] = useState({ format: "%m/%d/%Y" });

    useEffect(() => {
        onDataChange({
            "target": {
                "name": targetName,
                "value": timeData
            }
        })
    }, [timeData, onDataChange])

    // Handle the format dropdown change 
    const handleFormatChange = (e) => {
        const newFormat = e.target.value;
        const updatedData = { ...timeData, format: newFormat };
        setTimeData(updatedData);
        onDataChange({
            "target": {
                "name": targetName,
                "value": updatedData
            }
        });
    };

    return (
        <div className="time-component">
            <h3 className="text-lg font-semibold mb-4">Select Time Format</h3>
            <div className="mb-4">
                <label className="block font-medium mb-2">Format:</label>
                <select value={timeData.format} onChange={handleFormatChange} className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" >
                    {timeFormatOptions.map((option) => (<option key={option.value} value={option.value}> {option.label} </option>))}
                </select>
            </div>
        </div>
    );
};

export default JsonTime;
