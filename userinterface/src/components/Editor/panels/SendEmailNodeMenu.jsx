
const SendEmailNodeMenu = ({ data, setQuestionData }) => (
    <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Recipient:</label>
        <textarea
            value={data.recipient || ''}
            placeholder="Enter recipient"
            rows="3"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
    </div>
);

export default SendEmailNodeMenu;