import { timeFormatOptions } from '@/utils/datetime_formats';

const TimeNodeMenu = ({ data }) => (
    <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Format:</label>
        <select value={{ format: "%m/%d/%Y" }}
            // onChange={handleFormatChange} 
            className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white" >
            {timeFormatOptions.map((option) => (<option key={option.value} value={option.value}> {option.label} </option>))}
        </select>
    </div>
);

export default TimeNodeMenu;