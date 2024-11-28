import React, { useState } from 'react';
import DropDownNodeMenu from './DropDownNodeMenu';
import StartNodeMenu from './StartNodeMenu';
import TimeNodeMenu from './TimeNodeMenu';
import DateTimeNodeMenu from './DateTimeNodeMenu';
import DateNodeMenu from './DateNodeMenu';
import NumberNodeMenu from './NumberNodeMenu';
import AddressNodeMenu from './AddressNodeMenu';
import ClickListNodeMenu from './ClickListNodeMenu';
import EndNodeMenu from './EndNodeMenu';


const PropertiesBase = ({ title, onCollapse, onSave, children }) => {
  // Capitalizing the first letter of the title and making the rest lowercase
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  const [question, setQuestion] = useState('');
  const [nextStep, setNextStep] = useState('');

  const handleQuestionChange = (e) => setQuestion(e.target.value);
  const handleNextStepChange = (e) => setNextStep(e.target.value);

  return (
    <div className="rounded-lg border-[0.5px] border-gray-200 bg-white shadow-sm !min-w-[256px] max-w-[300px] p-3">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold">{formattedTitle}</h3>
        <button
          onClick={onCollapse}
          className="text-gray-500 hover:text-gray-700 text-sm"
          aria-label="Close"
        >
          ✖
        </button>
      </div>

      {/* Dynamic content for Question and Next Step */}
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
            value={question}
            onChange={handleQuestionChange}
            placeholder="Enter variable"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Render any additional children */}
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
            <option value="step1">Step 1</option>
            <option value="step2">Step 2</option>
            <option value="step3">Step 3</option>
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

  // Function to handle save action
  const handleSave = () => {
    console.log("Saved data:", selectedNode);
    onCollapse();
  };

  // Render based on the node type
  const renderProperties = () => {
    switch (selectedNode.type) {
      case 'start':
        return <StartNodeMenu data={selectedNode.data} />;
      case 'end':
        return <EndNodeMenu data={selectedNode.data} />;
      case 'time':
        return <TimeNodeMenu data={selectedNode.data} />;
      case 'date':
        return <DateNodeMenu data={selectedNode.data} />;
      case 'dateTime':
        return <DateTimeNodeMenu data={selectedNode.data} />;
      case 'dropDown':
        return <DropDownNodeMenu data={selectedNode.data} />;
      case 'number':
        return <NumberNodeMenu data={selectedNode.data} />;
      case 'address':
        return <AddressNodeMenu data={selectedNode.data} />;
      case 'clickList':
        return <ClickListNodeMenu data={selectedNode.data} />;
      default:
        return <DefaultNodeProperties data={selectedNode.data} />;
    }
  };

  return (
    <PropertiesBase
      title={`${selectedNode.type}`}
      onCollapse={onCollapse}
      onSave={handleSave}
    >
      {renderProperties()}
    </PropertiesBase>
  );
}
