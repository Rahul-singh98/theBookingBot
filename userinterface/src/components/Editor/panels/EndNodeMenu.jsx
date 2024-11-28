import React, { useState, useEffect } from 'react';
import { get_questions } from '@/api/questions';

const EndNodeMenu = ({ data, setQuestionData }) => {
    const [questionsList, setQuestionsList] = useState([]);
    const [endData, setEndData] = useState({
        redirect_to: '',
        query_params: []
    });

    // Fetch questions when component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await get_questions(data.initial_data?.data?.bot_id);
                if (response && response.items) {
                    const formattedQuestions = response.items
                        .filter(ques => ques.variable !== "") // Filter out empty variables
                        .map((ques) => ({
                            value: ques.variable,
                            label: ques.variable,
                        }));
                    setQuestionsList(formattedQuestions);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [data.initial_data?.data?.bot_id]);

    // Handle input changes for redirect_to
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEndData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            setQuestionData((prev) => ({
                ...prev,
                data: updatedData
            }));
            return updatedData;
        });
    };

    // Handle query params change
    const handleQueryParamsChange = (e, index) => {
        const { value } = e.target;
        const updatedQueryParams = [...endData.query_params];
        updatedQueryParams[index] = value;

        setEndData((prevData) => {
            const updatedData = { ...prevData, query_params: updatedQueryParams };
            setQuestionData((prev) => ({
                ...prev,
                data: updatedData
            }));
            return updatedData;
        });
    };

    // Add new query parameter
    const addQueryParam = () => {
        setEndData((prevData) => {
            const updatedData = {
                ...prevData,
                query_params: [...prevData.query_params, '']
            };
            setQuestionData((prev) => ({
                ...prev,
                data: updatedData
            }));
            return updatedData;
        });
    };

    // Remove query parameter
    const removeQueryParam = (index) => {
        const updatedQueryParams = endData.query_params.filter((_, i) => i !== index);

        setEndData((prevData) => {
            const updatedData = { ...prevData, query_params: updatedQueryParams };
            setQuestionData((prev) => ({
                ...prev,
                data: updatedData
            }));
            return updatedData;
        });
    };

    return (
        <div>
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

            {/* Query Params Dropdown */}
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Query Parameters:</label>
                {endData.query_params.map((param, index) => (
                    <div key={index} className="flex items-center mb-2 gap-2">
                        <select
                            value={param}
                            onChange={(e) => handleQueryParamsChange(e, index)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">Select Query Parameter</option>
                            {questionsList.map((question) => (
                                <option key={question.value} value={question.value}>
                                    {question.label}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => removeQueryParam(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addQueryParam}
                    className="text-blue-600 hover:underline mt-2"
                >
                    Add Query Parameter
                </button>
            </div>
        </div>
    );
};

export default EndNodeMenu;