// this is with voice message

// import "./chat.css";
// import { useState, useRef } from "react";

// const Chat = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunks = useRef([]);

//   const handleAudioToggle = async () => {
//     if (!isRecording) {
//       // Start recording
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         audioChunks.current.push(event.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(audioChunks.current, { type: "audio/wav" });
//         const url = URL.createObjectURL(blob);
//         setAudioUrl(url);
//         audioChunks.current = [];
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//     } else {
//       // Stop recording
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   return (
//     <div>
//       <div className="h-screen flex">
//         {/* Sidebar Section */}
//         <div className="w-1/3 bg-gray-100 p-4">{/* Sidebar content */}</div>

//         {/* Chat Window Section */}
//         <div className="flex-grow flex flex-col">
//           {/* Chat window content */}
//           <div className="p-4 border-t flex items-center">
//             <input
//               type="text"
//               placeholder="Enter message"
//               className="flex-grow p-2 border rounded-lg mr-2"
//             />
//             <button className="text-purple-600 hover:text-purple-800 text-2xl">
//               📎
//             </button>
//             <button
//               className={`ml-2 ${
//                 isRecording
//                   ? "text-red-600"
//                   : "text-purple-600 hover:text-purple-800"
//               } text-2xl`}
//               onClick={handleAudioToggle}
//             >
//               🎤
//             </button>
//           </div>
//           {audioUrl && (
//             <div className="p-4">
//               <audio controls src={audioUrl}></audio>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

// this is second
import React, {
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import "./chat.css";

interface Message {
  sender: string;
  message: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const url = `ws://localhost:8000/ws/socket-server/`;
    const chatMessage = new WebSocket(url);

    chatMessage.onopen = () => {
      console.log("WebSocket connection established in React");
      setChatSocket(chatMessage);
    };

    chatMessage.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "chat") {
        const newMessage: Message = {
          sender: data.sender,
          message: data.message,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    chatMessage.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    chatMessage.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (chatMessage.readyState === WebSocket.OPEN) {
        chatMessage.close();
      }
    };
  }, []);
  const sendMessage = () => {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      const message: Message = {
        sender: "You",
        message: messageInput,
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
            <div className="flex-grow text-lg font-semibold">John Doe</div>
          </div>
          {/* <form className="form">
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
            <input
              className="input"
              placeholder="Type your text"
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
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
          </form> */}
          <div className="bg-purple-200 p-3 rounded-lg mb-2 cursor-pointer">
            <div className="font-semibold">Jane Doe 2</div>
            <div className="text-sm">Hello Jane!</div>
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="p-4 border-b">
            <div className="text-lg font-semibold">Jane Doe</div>
            <div className="text-sm text-gray-500">April 18, 2023</div>
          </div>
          <div className="flex-grow p-4 overflow-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "You" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`bg-purple-500 text-white rounded-lg p-3 max-w-xs`}
                >
                  {msg.message}
                </div>
                <span className="ml-2 text-xs text-gray-500">11:06 AM</span>
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
              className="text-purple-600 hover:text-purple-800 text-2xl"
            >
              📎
            </button>
            <button className="ml-2 text-purple-600 hover:text-purple-800 text-2xl">
              🎤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
