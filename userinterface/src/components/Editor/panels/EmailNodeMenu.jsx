
const EmailNodeMenu = ({ data, setQuestionData }) => (
    <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Description:</label>
        <textarea
            value={data.description || ''}
            placeholder="Enter description"
            rows="3"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
    </div>
);

export default EmailNodeMenu;