import React, { useState, useEffect } from 'react';
import { dateTimeFormatOptions } from '@/utils/datetime_formats';


const JsonDateTime = ({ targetName, onDataChange }) => {
    const [dateTimeData, setTimeData] = useState({ format: "%m/%d/%Y" });

    useEffect(() => {
        onDataChange({
            "target": {
                "name": targetName,
                "value": dateTimeData
            }
        })
    }, [dateTimeData, onDataChange])

    // Handle the format dropdown change 
    const handleFormatChange = (e) => {
        const newFormat = e.target.value;
        const updateTimedData = { ...dateTimeData, format: newFormat };
        setTimeData(updateTimedData);
        onDataChange({
            "target": {
                "name": targetName,
                "value": updateTimedData
            }
        });
    };

    return (
        <div className="dateTime-component">
            <h3 className="text-lg font-semibold mb-4">Select Time Format</h3>
            <div className="mb-4">
                <label className="block font-medium mb-2">Format:</label>
                <select value={dateTimeData.format} onChange={handleFormatChange} className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" >
                    {dateTimeFormatOptions.map((option) => (<option key={option.value} value={option.value}> {option.label} </option>))}
                </select>
            </div>
        </div>
    );
};

export default JsonDateTime;
