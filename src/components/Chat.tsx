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

interface Message {
  sender: string;
  message: string;
  timestamp: string; // Added timestamp field
}

const Chat = () => {
  const user = useAppSelector(useCurrentUser);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [reconnectInterval, setReconnectInterval] = useState<number | null>(
    null
  );

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
          timestamp: data.timestamp, // Include timestamp
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else if (data.type === "history") {
        const existingMessages: Message[] = data.messages.map((msg: any) => ({
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp, // Include timestamp in history
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
