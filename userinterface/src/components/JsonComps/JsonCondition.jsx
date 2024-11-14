import React, { useState, useEffect } from 'react';

const JsonCondition = ({ targetName, onDataChange }) => {
    const baseClassName = "w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white"

    // Initial state for branches and default next question ID 
    const [conditionData, setConditionData] = useState({
        branches: [{
            condition: {
                variable: '',
                operator: 'eq', // default operator 
                value: '',
            },
            next_question_id: '',
        },
        ],
        default_next_question_id: '',
    });

    // Handle changes in condition data 
    const handleChange = (e) => {
        const { name, value } = e.target;
        const [branchIndex, field] = name.split('.'); // Split the name to access nested fields 
        const updatedData = { ...conditionData };

        if (field) {
            // Update nested fields (e.g., condition.variable, condition.operator, etc.) 
            updatedData.branches[branchIndex][field] = value;
        }
        else {
            // Update top-level fields (e.g., default_next_question_id) 
            updatedData[name] = value;
        }
        setConditionData(updatedData);
        onDataChange({
            "target": {
                "name": targetName,
                "value": updatedData
            }
        }); // Notify the parent component with the updated data 
    };

    // Add a new branch condition 
    const handleAddBranch = () => {
        setConditionData((prevData) => (
            {
                ...prevData,
                branches: [...prevData.branches, { condition: { variable: '', operator: 'eq', value: '', }, next_question_id: '', },],
            }));
    };

    // Remove a branch condition 
    const handleRemoveBranch = (index) => {
        setConditionData((prevData) => ({ ...prevData, branches: prevData.branches.filter((_, i) => i !== index), }));
    };

    // Effect to initialize the parent with current state data 
    useEffect(() => {
        onDataChange({
            "target": {
                "name": targetName,
                "value": conditionData
            }
        });
    }, [conditionData]);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Default Next Question ID</label>
                <input type="text" name="default_next_question_id"
                    value={conditionData.default_next_question_id}
                    onChange={handleChange}
                    className={`${baseClassName}`}
                    placeholder="Enter the default next question ID" />

                <small className="text-gray-500">The default next question ID if no condition matches.</small>
            </div>
            {conditionData.branches.map((branch, index) => (
                <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-gray-800">Condition {index + 1}</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Variable</label>
                        <input type="text"
                            name={`branches.${index}.condition.variable`}
                            value={branch.condition.variable}
                            onChange={handleChange}
                            className={`${baseClassName}`} placeholder="Enter variable (e.g., bk_preference)" />

                        <small className="text-gray-500">The variable to check (e.g., bk_preference).</small>
                    </div>
                    <div>

                        <label className="block text-sm font-medium text-gray-700">Operator</label>
                        <select
                            name={`branches.${index}.condition.operator`}
                            value={branch.condition.operator} onChange={handleChange}
                            className={`${baseClassName}`} >
                            <option value="eq">Equal to</option>
                            <option value="neq">Not equal to</option>
                            <option value="gt">Greater than</option>
                            <option value="lt">Less than</option>
                            <option value="gte">Greater than or equal to</option>
                            <option value="lte">Less than or equal to</option>
                        </select>

                        <small className="text-gray-500">The operator to use for comparison (e.g., eq, neq, gt).</small>
                    </div>
                    <div>

                        <label className="block text-sm font-medium text-gray-700">Value</label>
                        <input type="text"
                            name={`branches.${index}.condition.value`}
                            value={branch.condition.value} onChange={handleChange}
                            className={`${baseClassName}`}
                            placeholder="Enter value to compare" />

                        <small className="text-gray-500">The value to compare with the variable.</small>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Next Question ID</label>
                        <input
                            type="text"
                            name={`branches.${index}.next_question_id`}
                            value={branch.next_question_id}
                            onChange={handleChange}
                            className={`${baseClassName}`}
                            placeholder="Enter next question ID" />
                        <small className="text-gray-500">The next question ID if this condition is met.</small>
                    </div>
                    <button type="button"
                        onClick={() => handleRemoveBranch(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-2" > Remove Condition </button> </div>))
            }
            <button
                type="button"
                onClick={handleAddBranch}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4" > Add Condition </button> </div>
    );
};

export default JsonCondition;
