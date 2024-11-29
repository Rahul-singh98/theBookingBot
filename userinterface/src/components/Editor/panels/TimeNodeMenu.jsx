import { useState, useEffect } from 'react';
import { timeFormatOptions } from '@/utils/datetime_formats';

const TimeNodeMenu = ({ data, setQuestionData }) => {
    const [format, setFormat] = useState('');

    // Sync state when initial_data changes
    useEffect(() => {
        if (data.initial_data?.data?.format !== format) {
            setFormat(data.initial_data?.data?.format || '');
        }
    }, []);

    // Handle format change
    const handleFormatChange = (e) => {
        const newFormat = e.target.value;
        setFormat(newFormat);
        setQuestionData((prev) => ({
            ...prev,
            data: { ...prev.data, format: newFormat },
        }));
    };


    return (
        <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Format:</label>
            <select value={format}
                onChange={handleFormatChange}
                className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
            >

                {
                    format === '' && <option value="" disabled>Select Option</option>
                }

                {timeFormatOptions.map((option) => (<option key={option.value} value={option.value}> {option.label} </option>))}
            </select>
        </div>
    )
};

export default TimeNodeMenu;