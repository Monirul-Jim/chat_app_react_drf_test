const ChatIn = () => {
  return (
    <div className="h-screen flex">
      {/* Sidebar Section */}
      <div className="w-1/3 bg-gray-100 p-4">
        <div className="flex items-center mb-4">
          <div className="flex-grow text-lg font-semibold">John Doe</div>
        </div>
        {/* search bar */}
        <form className="form">
          <button>
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <input className="input" placeholder="Type your text" type="text" />
          <button className="reset" type="reset">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </form>
        {/* search bar end */}
        <div className="bg-purple-200 p-3 rounded-lg mb-2 cursor-pointer">
          <div className="font-semibold">Jane Doe 2</div>
          <div className="text-sm">Hello Jane!</div>
        </div>
      </div>

      {/* Chat Window Section */}
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
    </div>
  );
};

export default ChatIn;
