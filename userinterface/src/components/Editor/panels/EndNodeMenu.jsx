import React, { useState } from 'react';

const EndNodeMenu = ({ data }) => {
    const [endData, setEndData] = useState({ redirect_to: '', query_params: [] });

    // Handle input changes for redirect_to and query_params
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEndData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            onDataChange({
                target: {
                    name: targetName,
                    value: updatedData
                }
            }); // Call onDataChange with updated data
            return updatedData;
        });
    };

    // Handle query_params as an array of values
    const handleQueryParamsChange = (e, index) => {
        const { value } = e.target;
        const updatedQueryParams = [...endData.query_params];
        updatedQueryParams[index] = value;
        setEndData((prevData) => {
            const updatedData = { ...prevData, query_params: updatedQueryParams };
            onDataChange({
                target: {
                    name: targetName,
                    value: updatedData
                }
            });
            return updatedData;
        });
    };

    const addQueryParam = () => {
        setEndData((prevData) => {
            const updatedData = { ...prevData, query_params: [...prevData.query_params, ''] };
            onDataChange({
                target: {
                    name: targetName,
                    value: updatedData
                }
            });
            return updatedData;
        });
    };

    return (
        <div >
            <h4 className="text-lg font-semibold mb-4">Configure End</h4>

            {/* Redirect URL Input */}
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Redirection URL:</label>
                <input
                    type="text"
                    name="redirect_to"
                    value={endData.redirect_to}
                    onChange={handleInputChange}
                    placeholder="Enter redirection URL"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
            </div>

            {/* Query Params Inputs */}
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Query Parameters:</label>
                {endData.query_params.map((param, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={param}
                            onChange={(e) => handleQueryParamsChange(e, index)}
                            placeholder={`Query Param ${index + 1}`}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addQueryParam}
                    className="text-blue-600 hover:underline"
                >
                    Add Query Parameter
                </button>
            </div>
        </div>
    );
};

export default EndNodeMenu;
