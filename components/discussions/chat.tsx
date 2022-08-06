import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { timeSince } from "../../utils/helper";

interface Props {
  roomId: string;
}

const ChatSection: React.FC<Props> = ({ roomId }) => {
  const { isInitialized, Moralis, user } = useMoralis();
  const [text, setText] = React.useState("");
  const [messages, setMessages] = React.useState<any[]>([]);

  useEffect(() => {
    if (isInitialized) {
      fetchChats();
    }
  }, [isInitialized]);

  const fetchChats = async () => {
    const messageQuery = new Moralis.Query("Messages");
    messageQuery.equalTo("roomId", roomId);
    const results = await messageQuery.find();
    setMessages(results);

    let subscription = await messageQuery.subscribe();
    subscription.on("create", (obj) => {
      console.log("obj :>> ", obj);
      messages.push(obj);
      setMessages(messages);
    });
  };

  const sendMessage = async () => {
    if (text !== "") {
      const message = new Moralis.Object("Messages");
      message.set("text", text);
      message.set("roomId", roomId);
      message.set("username", user.getUsername());
      message.set("userAddress", user.toJSON().accounts[0]);
      await message.save();
      setText("");
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="max-w-2xl w-full rounded-xl relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-500 to-pink-500 dark:text-white focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800">
          <div className="rounded-xl w-full relative transition-all ease-in duration-75 bg-white dark:bg-gray-900">
            <div className="w-full">
              <div className="relative w-full p-5 overflow-y-auto h-[40rem]">
                <ul className="space-y-2">
                  {messages.map((message) => (
                    <li
                      className={`flex ${
                        message.get("username") === user.getUsername()
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                        <span className="block text-xs">
                          {message.get("username")} -{" "}
                          {timeSince(message.get("createdAt").getTime()) ===
                          "-1 seconds"
                            ? "Just now"
                            : timeSince(message.get("createdAt").getTime())}
                        </span>
                        <span className="block">{message.get("text")}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center w-full p-3 border-t border-gray-500">
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      sendMessage();
                    }
                  }}
                  placeholder="Message"
                  className="block w-full py-3 pl-4 mx-3 bg-gray-100 rounded-full outline-none text-gray-700"
                  name="message"
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <button
                  type="submit"
                  onClick={() => {
                    sendMessage();
                  }}
                >
                  <svg
                    className="w-7 h-7 text-gray-500 origin-center transform rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSection;
