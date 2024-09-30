import {
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import "./chat.css";
import { useAppSelector } from "../redux/feature/hooks";
import { useCurrentUser } from "../redux/feature/authSlice";
import { useLazyGetAllLoginUserQuery } from "../redux/api/chatApi";

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

const Chat = () => {
  const user = useAppSelector(useCurrentUser);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [reconnectInterval, setReconnectInterval] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [triggerSearch, { data: users, isLoading, error }] =
    useLazyGetAllLoginUserQuery();
  const handleSearch = () => {
    triggerSearch(searchTerm);
  };
  const connectWebSocket = () => {
    const url = `ws://localhost:8000/ws/socket-server/`;
    const chatMessage = new WebSocket(url);

    chatMessage.onopen = () => {
      console.log("WebSocket connection established in React");
      setChatSocket(chatMessage);
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
        setReconnectInterval(null);
      }
    };

    chatMessage.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "chat") {
        const newMessage: Message = {
          sender: data.sender,
          message: data.message,
          timestamp: data.timestamp,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else if (data.type === "history") {
        const existingMessages: Message[] = data.messages.map((msg: any) => ({
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp,
        }));
        setMessages(existingMessages);
      }
    };

    chatMessage.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    chatMessage.onclose = () => {
      console.log("WebSocket connection closed. Attempting to reconnect...");
      if (!reconnectInterval) {
        setReconnectInterval(
          setInterval(() => {
            console.log("Reconnecting to WebSocket...");
            connectWebSocket();
          }, 5000)
        );
      }
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      const timestamp = new Date().toLocaleTimeString();
      const message: Message = {
        sender: user?.username || "Anonymous",
        message: messageInput,
        timestamp: timestamp,
      };
      chatSocket.send(JSON.stringify(message));
      setMessageInput("");
    } else {
      console.error("WebSocket connection is not open.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSendButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div>
      <div className="h-screen flex">
        <div className="w-1/3 bg-gray-100 p-4">
          <div className="flex items-center mb-4">
            <div className="flex-grow text-lg font-semibold">
              {user?.username}
            </div>
            <a href="/login">Login</a>
          </div>
          {/* here start search term */}
          <div>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users"
                className="flex-1 px-4 py-2 text-gray-700 bg-white border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Search
              </button>
            </div>

            {isLoading && <p>Loading...</p>}

            {error && (
              <p>
                Error:{" "}
                {"status" in error
                  ? `Status: ${error.status}`
                  : error.message || "An error occurred"}
              </p>
            )}

            {users && users.length > 0 ? (
              <ul className="mt-4 bg-white rounded-md shadow-md">
                {users.map((user: User) => (
                  <li
                    key={user.username}
                    className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-100 transition duration-200"
                  >
                    <div>
                      <p className="font-semibold">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              searchTerm &&
              !isLoading && <p className="mt-2 text-gray-500">No users found</p>
            )}
          </div>

          {/* here end search term */}
          <div className="bg-purple-200 p-3 rounded-lg mb-2 cursor-pointer">
            <div className="font-semibold">{user?.username}</div>
            <div className="text-sm">Jim</div>
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="p-4 border-b">
            <div className="text-lg font-semibold">Chat</div>
            <div className="text-sm text-gray-500">Current Conversation</div>
          </div>
          <div className="flex-grow p-4 overflow-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === user?.username
                    ? "justify-end"
                    : "justify-start"
                } mb-4`}
              >
                <div
                  className={`bg-purple-500 text-white rounded-lg p-3 max-w-xs`}
                >
                  {" "}
                  {msg.message}
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>{" "}
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex items-center">
            <input
              type="text"
              placeholder="Enter message"
              className="flex-grow p-2 border rounded-lg mr-2"
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendButtonClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Send
            </button>
            <button className="text-purple-600 hover:text-purple-800 text-2xl">
              📎
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
