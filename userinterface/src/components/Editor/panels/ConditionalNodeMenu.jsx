import React, { useState, useEffect } from 'react';
import { get_questions } from '@/api/questions';

const ConditionalNodeMenu = ({ data, setQuestionData }) => {
    const [questionsList, setQuestionsList] = useState([]);
    const [conditionData, setConditionData] = useState({
        branches: [{
            condition: {
                variable: '',
                operator: 'eq',
                value: '',
            },
            next_question_id: '',
        }],
        default_next_question_id: '',
    });

    // Fetch questions when the component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await get_questions(data.initial_data?.data?.bot_id);
                if (response && response.items) {
                    const formattedQuestions = response.items.map((ques) => ({
                        value: ques.id,
                        label: ques.question_type + " - " + ques.question,
                    }));
                    setQuestionsList(formattedQuestions);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [get_questions]);

    const operators = [
        { value: 'eq', label: 'Equals' },
        { value: 'neq', label: 'Not Equals' },
        { value: 'gt', label: 'Greater Than' },
        { value: 'lt', label: 'Less Than' },
        { value: 'gte', label: 'Greater Than or Equal' },
        { value: 'lte', label: 'Less Than or Equal' },
    ];

    const handleBranchChange = (index, e) => {
        const { name, value } = e.target;
        const updatedBranches = [...conditionData.branches];

        if (name.startsWith('condition.')) {
            const conditionKey = name.split('.')[1];
            updatedBranches[index] = {
                ...updatedBranches[index],
                condition: {
                    ...updatedBranches[index].condition,
                    [conditionKey]: value
                }
            };
        } else {
            updatedBranches[index] = {
                ...updatedBranches[index],
                [name]: value
            };
        }

        const updatedConditionData = {
            ...conditionData,
            branches: updatedBranches
        };

        setConditionData(updatedConditionData);
        setQuestionData((prev) => ({
            ...prev,
            data: updatedConditionData
        }));
    };

    const addBranch = () => {
        const newBranch = {
            condition: {
                variable: '',
                operator: 'eq',
                value: '',
            },
            next_question_id: '',
        };

        const updatedConditionData = {
            ...conditionData,
            branches: [...conditionData.branches, newBranch]
        };

        setConditionData(updatedConditionData);
        setQuestionData((prev) => ({
            ...prev,
            data: updatedConditionData
        }));
    };

    const removeBranch = (index) => {
        const updatedBranches = conditionData.branches.filter((_, i) => i !== index);

        const updatedConditionData = {
            ...conditionData,
            branches: updatedBranches
        };

        setConditionData(updatedConditionData);
        setQuestionData((prev) => ({
            ...prev,
            data: updatedConditionData
        }));
    };

    const handleDefaultNextQuestionChange = (e) => {
        const { value } = e.target;
        const updatedConditionData = {
            ...conditionData,
            default_next_question_id: value
        };

        setConditionData(updatedConditionData);
        setQuestionData((prev) => ({
            ...prev,
            data: updatedConditionData
        }));
    };

    return (
        <div>
            <h3 className="text-md font-semibold mb-4">Conditional Routing</h3>

            {conditionData.branches.map((branch, index) => (
                <div key={index} className="border rounded-md p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Branch {index + 1}</h4>
                        {conditionData.branches.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeBranch(index)}
                                className="text-red-500 hover:text-red-700 text-xs"
                            >
                                Remove Branch
                            </button>
                        )}
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium">Variable:</label>
                        <input
                            type="text"
                            name="condition.variable"
                            value={branch.condition.variable}
                            onChange={(e) => handleBranchChange(index, e)}
                            placeholder="Enter Variable Name"
                            className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium">Operator:</label>
                        <select
                            name="condition.operator"
                            value={branch.condition.operator}
                            onChange={(e) => handleBranchChange(index, e)}
                            className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        >
                            {operators.map((op) => (
                                <option key={op.value} value={op.value}>
                                    {op.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium">Value:</label>
                        <input
                            type="text"
                            name="condition.value"
                            value={branch.condition.value}
                            onChange={(e) => handleBranchChange(index, e)}
                            placeholder="Enter Condition Value"
                            className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedarg dark:bg-meta-4 dark:text-white"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium">Next Question:</label>
                        <select
                            name="next_question_id"
                            value={branch.next_question_id}
                            onChange={(e) => handleBranchChange(index, e)}
                            className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        >
                            <option value="">Select Next Question</option>
                            {questionsList.map((question) => (
                                <option key={question.value} value={question.value}>
                                    {question.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <div className="flex justify-end mb-3">
                <button
                    type="button"
                    onClick={addBranch}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                >
                    Add Branch
                </button>
            </div>

            <div className="mb-2">
                <label className="block text-sm font-medium">Default Next Question:</label>
                <select
                    name="default_next_question_id"
                    value={conditionData.default_next_question_id}
                    onChange={handleDefaultNextQuestionChange}
                    className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                    <option value="">Select Default Next Question</option>
                    {questionsList.map((question) => (
                        <option key={question.value} value={question.value}>
                            {question.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ConditionalNodeMenu;