import React, { useState, useEffect } from 'react';
import DropDownNodeMenu from './DropDownNodeMenu';
import StartNodeMenu from './StartNodeMenu';
import TimeNodeMenu from './TimeNodeMenu';
import DateTimeNodeMenu from './DateTimeNodeMenu';
import DateNodeMenu from './DateNodeMenu';
import NumberNodeMenu from './NumberNodeMenu';
import AddressNodeMenu from './AddressNodeMenu';
import ClickListNodeMenu from './ClickListNodeMenu';
import EndNodeMenu from './EndNodeMenu';
import EmailNodeMenu from './EmailNodeMenu';
import PhoneNodeMenu from './PhoneNodeMenu';
import InputNodeMenu from './InputNodeMenu';
import { update_questions, get_questions } from '@/api/questions';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ConditionalNodeMenu from './ConditionalNodeMenu';

const PropertiesBase = ({ data, title, onCollapse, onSave, children, setQuestionData, bot_id }) => {
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  const { afterLogout } = useAuth();
  const navigate = useNavigate();

  // Initialize states based on `data.initial_data`
  const [nextStep, setNextStep] = useState(data.initial_data?.next_ques || '');
  const [variableName, setVariableName] = useState(data.initial_data?.variable || '');
  const [questionType, setQuestionType] = useState(data.initial_data?.question_type || '');
  const [question, setQuestion] = useState(data.initial_data?.question || ''); // Initialize question state
  const [questionsList, setQuestionsList] = useState([]); // New state for questions

  // Fetch questions when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await get_questions(bot_id); // Fetch the questions using the bot_id
        if (response && response.items) {
          const formattedQuestions = response.items.map((ques) => ({
            value: ques.id,
            label: ques.question,
          }));
          setQuestionsList(formattedQuestions); // Store the formatted questions
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [bot_id]); // Fetch questions whenever the bot_id changes

  // Handle changes to the inputs and propagate to `setQuestionData`
  const handleQuestionChange = (e) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
    setQuestionData((prev) => ({ ...prev, question: newQuestion }));
  };

  const handleNextStepChange = (e) => {
    const newNextStep = e.target.value;
    setNextStep(newNextStep);
    setQuestionData((prev) => ({ ...prev, next_ques: newNextStep }));
  };

  const handleVariableNameChange = (e) => {
    const newVariableName = e.target.value.toLowerCase();
    setVariableName(newVariableName);
    setQuestionData((prev) => ({ ...prev, variable: newVariableName }));
  };

  const handleQuestionTypeChange = (e) => {
    const newQuestionType = e.target.value;
    setQuestionType(newQuestionType);
    setQuestionData((prev) => ({ ...prev, question_type: newQuestionType }));
  };

  return (
    <div className="rounded-lg border-[0.5px] border-gray-200 bg-white shadow-sm !min-w-[256px] max-w-[300px] p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold">{formattedTitle}</h3>
        <button onClick={onCollapse} className="text-gray-500 hover:text-gray-700 text-sm" aria-label="Close">
          ✖
        </button>
      </div>

      <div className="mb-3">
        {/* Question Input */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Question:</label>
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Enter Question"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Variable Input */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Variable Name:</label>
          <input
            type="text"
            value={variableName}
            onChange={handleVariableNameChange}
            placeholder="Enter variable"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Hidden Question Type Input */}
        <input type="text" value={questionType} hidden />

        {children}

        {/* Next Step Dropdown */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Next Step:</label>
          <select
            value={nextStep}
            onChange={handleNextStepChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select Next Step</option>
            {questionsList.map((ques) => (
              <option key={ques.value} value={ques.value}>
                {ques.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save button */}
      <div className="text-right">
        <button
          onClick={onSave}
          className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const DefaultNodeProperties = ({ data }) => (
  <div>
    <p>Label: {data.label}</p>
  </div>
);

export default function PropertiesPanel({ selectedNode, onCollapse }) {
  if (!selectedNode) return null;

  const [questionData, setQuestionData] = useState(selectedNode.data.initial_data || {});

  const handleSave = async () => {
    try {
      const response = await update_questions(
        selectedNode.id,
        selectedNode.bot_id,
        questionData.question,
        questionData.question_type,
        questionData.data,
        questionData.variable,
        questionData.next_ques
      )

    } catch (err) {
      if (err.message === "Unauthorized") {
        afterLogout();
        navigate(`/login?next=${location.pathname}`);
      } else {
        console.error("Error loading questions:", err);
      }
    }

    onCollapse();
  };

  const renderProperties = () => {
    switch (selectedNode.type) {
      case 'start':
        return <StartNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'end':
        return <EndNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'time':
        return <TimeNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'date':
        return <DateNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'dateTime':
        return <DateTimeNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'dropDown':
        return <DropDownNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'number':
        return <NumberNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'address':
        return <AddressNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'clickList':
        return <ClickListNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'email':
        return <EmailNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'phone':
        return <PhoneNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'input':
        return <InputNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      case 'conditional':
        return <ConditionalNodeMenu data={selectedNode.data} setQuestionData={setQuestionData} />;
      default:
        return <DefaultNodeProperties data={selectedNode.data} setQuestionData={setQuestionData} />;
    }
  };

  return (
    <PropertiesBase
      data={selectedNode.data}
      title={`${selectedNode.type}`}
      onCollapse={onCollapse}
      onSave={handleSave}
      setQuestionData={setQuestionData}
    >
      {renderProperties()}
    </PropertiesBase>
  );
}
