const ChatWindow = () => {
  return (
    <div className="flex-grow flex flex-col">
      <div className="p-4 border-b">
        <div className="text-lg font-semibold">Jane Doe</div>
        <div className="text-sm text-gray-500">April 18, 2023</div>
      </div>
      <div className="flex-grow p-4 overflow-auto">
        <div className="flex justify-end mb-4">
          <div className="bg-purple-500 text-white rounded-lg p-3 max-w-xs">
            Hello Jane!
          </div>
          <span className="ml-2 text-xs text-gray-500">11:06 AM</span>
        </div>
      </div>
      <div className="p-4 border-t flex items-center">
        <input
          type="text"
          placeholder="Enter message"
          className="flex-grow p-2 border rounded-lg mr-2"
        />
        <button className="text-purple-600 hover:text-purple-800">📎</button>
        <button className="ml-2 text-purple-600 hover:text-purple-800">
          🎤
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
