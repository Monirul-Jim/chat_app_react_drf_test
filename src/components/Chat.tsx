import {
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { useAppDispatch, useAppSelector } from "../redux/feature/hooks";
import { logout, useCurrentUser } from "../redux/feature/authSlice";
import { useLazyGetAllLoginUserQuery } from "../redux/api/chatApi";
import {
  useAddedSearchUserMutation,
  useGetAddedUsersQuery,
  useLogoutMutation,
} from "../redux/api/authApi";
import { useNavigate } from "react-router-dom";
import VideoButton from "../assets/video_call_icon.png";
import AudioButton from "../assets/audio_call.png";
import { toast } from "react-toastify";
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

  const [triggerSearch, { data: users, isLoading, error }] =
    useLazyGetAllLoginUserQuery();

  const [addedSearchUser] = useAddedSearchUserMutation();
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutMutation();
  const navigate = useNavigate();
  // console.log(getUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [reconnectInterval, setReconnectInterval] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: getUserData,
    isLoading: userIsLoading,
    isError,
  } = useGetAddedUsersQuery(null);

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
  const handleAddUser = async (userToAdd: User) => {
    try {
      const userData = {
        username: userToAdd.username,
        first_name: userToAdd.first_name,
        last_name: userToAdd.last_name,
        email: userToAdd.email,
        added_by: user.user_id,
      };
      await addedSearchUser(userData).unwrap();
      toast.success("Successfully added user");
    } catch (error: any) {
      // Handle the error
      console.error("Failed to add user", error);
      if (
        error.status === 400 &&
        error.data?.error === "You have already added this user."
      ) {
        toast.info("You have already added this user.");
      } else {
        toast.error("Failed to add user. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // send voice message
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const tempAudioChunks: Blob[] = []; // Temporary array for holding the chunks

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          tempAudioChunks.push(event.data); // Push data into temporary array
        }
      };

      recorder.onstop = () => {
        if (tempAudioChunks.length > 0) {
          const audioBlob = new Blob(tempAudioChunks, { type: "audio/wav" });
          sendVoiceMessage(audioBlob);
        } else {
          console.error("No audio data captured.");
        }
        setAudioChunks([]); // Clear chunks after sending
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = (audioBlob: Blob) => {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const message = {
          sender: user?.username || "Anonymous",
          message: reader.result, // This is a base64 encoded string
          timestamp: new Date().toLocaleTimeString(),
        };
        chatSocket.send(JSON.stringify(message));
      };
      reader.readAsDataURL(audioBlob); // Read the audio file as a base64 encoded string
    } else {
      console.error("WebSocket connection is not open.");
    }
  };
  if (userIsLoading) {
    <p>User loading....</p>;
  }

  return (
    <div>
      <div className="h-screen flex">
        <div className="w-1/3 bg-gray-100 p-4">
          <div className="flex items-center mb-4">
            <div className="flex-grow text-lg font-semibold">
              {user?.username}
            </div>
            {user ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <a href="/login">Login</a>
            )}
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
                {users.map((userToAdd: User) => (
                  <li
                    key={userToAdd.username}
                    className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-100 transition duration-200"
                  >
                    <button onClick={() => handleAddUser(userToAdd)}>
                      <div>
                        <p className="font-semibold">
                          {userToAdd?.first_name} {userToAdd?.last_name}
                        </p>
                        <p className="text-gray-600">{userToAdd?.email}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              searchTerm &&
              !isLoading && <p className="mt-2 text-gray-500">No users found</p>
            )}
          </div>

          {/* here end search term */}
          <div>
            {getUserData && getUserData.length > 0 ? (
              getUserData?.map((user: User) => (
                <div
                  key={user.username}
                  className="bg-purple-200 p-3 rounded-lg mb-2 cursor-pointer"
                >
                  <div className="font-semibold">{user?.username}</div>
                  <div className="text-sm">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-sm">{user?.email}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold">{user?.username}</div>
              <div className="text-sm text-gray-500">online</div>
            </div>
            <div className="flex space-x-2 mr-10 gap-6">
              {" "}
              {/* Adjust margin-right to 50px */}
              <button>
                <img src={VideoButton} alt="Video Call Button" />
              </button>
              <button>
                <img src={AudioButton} alt="Audio Call Button" />
              </button>
            </div>
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
                {msg.message.startsWith("data:audio/") ? (
                  // Render an audio player for audio messages
                  <audio
                    controls
                    className="bg-purple-500 text-white rounded-lg p-3 max-w-xs"
                  >
                    <source src={msg.message} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  // Render text message
                  <div
                    className={`bg-purple-500 text-white rounded-lg p-3 max-w-xs`}
                  >
                    {msg.message}
                  </div>
                )}
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
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
            {/* <button className="text-purple-600 hover:text-purple-800 ">
              Voice Send
            </button> */}
            <button
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                }
              }}
              className={`text-purple-600 hover:text-purple-800 ${
                isRecording ? "bg-red-500" : ""
              }`}
            >
              {isRecording ? "Stop Recording" : "Voice Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

// here start second code
