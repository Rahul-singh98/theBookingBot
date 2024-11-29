import React, { useState, useEffect } from 'react';

// ClickListNodeMenu component
const ClickListNodeMenu = ({ data, setQuestionData }) => {
  const [dropdownData, setDropdownData] = useState({
    description: data.initial_data?.data?.description || '',
    options: data.initial_data?.data?.options || [],
  });
  const [newOption, setNewOption] = useState({ id: '', value: '', text: '' });

  // Handle input changes for label, description, id, name
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDropdownData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  // Effect to update setQuestionData after state is set
  useEffect(() => {
    setQuestionData((prev) => ({
      ...prev,
      data: { ...prev.data, ...dropdownData },
    }));
  }, [dropdownData, setQuestionData]);

  // Handle changes for new option fields
  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setNewOption((prevOption) => ({ ...prevOption, [name]: value }));
  };

  // Add new option to options list
  const addOption = () => {
    if (newOption.value && newOption.id) {
      const updatedOptions = Array.isArray(dropdownData.options)
        ? [...dropdownData.options, newOption]
        : [newOption];
      const updatedData = { ...dropdownData, options: updatedOptions };
      setDropdownData(updatedData);
      setNewOption({ id: '', value: '', text: '' });
    }
  };

  // Remove option by index
  const removeOption = (index) => {
    const updatedOptions = dropdownData.options.filter((_, i) => i !== index);
    const updatedData = { ...dropdownData, options: updatedOptions };
    setDropdownData(updatedData);
  };

  return (
    <div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Description:</label>
        <input
          type="text"
          name="description"
          value={dropdownData.description}
          onChange={handleInputChange}
          placeholder="Enter Description"
          className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
        />
      </div>

      {/* Options List */}
      <h4 className="text-sm font-medium mb-2">Options:</h4>
      <ul className="options-list mb-3">
        {dropdownData.options?.map((option, index) => (
          <li key={index} className="flex items-center gap-1 mb-1">
            <span className="flex-1 text-sm">
              <strong>Value:</strong> {option.value} | <strong>Text:</strong> {option.text}
            </span>
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Add New Option */}
      <div className="flex gap-1 mb-3">
        <input
          type="text"
          name="id"
          value={newOption.id}
          onChange={handleOptionChange}
          placeholder="ID"
          className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
        />
        <input
          type="text"
          name="text"
          value={newOption.text}
          onChange={handleOptionChange}
          placeholder="Text"
          className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
        />
        <input
          type="text"
          name="value"
          value={newOption.value}
          onChange={handleOptionChange}
          placeholder="Value"
          className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
        />

        <button
          type="button"
          onClick={addOption}
          className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ClickListNodeMenu;
