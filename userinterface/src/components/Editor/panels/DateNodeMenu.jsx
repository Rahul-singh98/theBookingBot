import { useState, useEffect } from 'react';
import { dateFormatOptions } from '@/utils/datetime_formats';

const DateNodeMenu = ({ data, setQuestionData }) => {
    const [format, setFormat] = useState('');

    useEffect(() => {
        const initialFormat = data.initial_data?.data?.format || '';
        if (initialFormat !== format) {
            setFormat(initialFormat);
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
            <select
                value={format}
                onChange={handleFormatChange}
                className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white"
                required
            >
                {/* Default "Select Node" option */}
                {format === '' && <option value="" disabled>Select Option</option>}

                {dateFormatOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DateNodeMenu;
