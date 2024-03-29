import { useState, useContext } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { MessageModel } from "../models/Message";
import { Message } from "./Message";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect } from "react";

import { ConversationModel } from "../models/Conversation";

import { ChatLoader } from "./ChatLoader";

export function Chat() {
  const { conversationName } = useParams();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(2);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);

  const [conversation, setConversation] = useState<ConversationModel | null>(
    null
  );

  const { user } = useContext(AuthContext);

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://127.0.0.1:8000/${conversationName}/` : null,
    {
      queryParams: {
        token: user ? user.access : "",
      },
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "welcome_message":
            setWelcomeMessage(data.message);
            break;
          case "chat_message_echo":
            console.log(data);
            setMessageHistory((prev: any) => [data.message, ...prev]);
            break;
          case "last_10_messages":
            setMessageHistory(data.messages);
            setHasMoreMessages(data.has_more);
            break;
          case "user_join":
            setParticipants((pcpts: string[]) => {
              if (!pcpts.includes(data.user)) {
                return [...pcpts, data.user];
              }
              return pcpts;
            });
            break;
          case "user_leave":
            setParticipants((pcpts: string[]) => {
              const newPcpts = pcpts.filter((x) => x !== data.user);
              return newPcpts;
            });
            break;
          case "online_user_list":
            setParticipants(data.users);
            break;
          default:
            console.log("Unknown Message type!");
            break;
        }
      },
    }
  );

  useEffect(() => {
    async function fetchConversation() {
      const apiRes = await fetch(
        `http://127.0.0.1:8000/api/v1/conversations/${conversationName}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.access}`,
          },
        }
      );
      if (apiRes.status === 200) {
        const data: ConversationModel = await apiRes.json();
        setConversation(data);
      }
    }
    fetchConversation();
  }, [conversationName, user]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  async function fetchMessages() {
    const apiRes = await fetch(
      `http://127.0.0.1:8000/api/v1/messages/?conversation=${conversationName}&page=${page}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access}`,
        },
      }
    );
    if (apiRes.status === 200) {
      const data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: MessageModel[];
      } = await apiRes.json();
      setHasMoreMessages(data.next !== null);
      setPage(page + 1);
      setMessageHistory((prev: MessageModel[]) => prev.concat(data.results));
    }
  }

  function handleChangeMessage(e: any) {
    setMessage(e.target.value);
  }

  function handleSubmit() {
    sendJsonMessage({
      type: "chat_message",
      message,
    });
    setMessage("");
  }

  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>
      {conversation && (
        <div className="py-4">
          <h3 className="text-3xl font-semibold text-gray-900">
            Chat with user: {conversation.other_user.username}
          </h3>
          <span className="text-sm">
            {conversation.other_user.username} is currently
            {participants.includes(conversation.other_user.username)
              ? " online"
              : " offline"}
          </span>
        </div>
      )}
      <hr />
      <ul>
        <div
          id="scrollableDiv"
          className="h-[20rem] mt-3 flex flex-col-reverse relative w-full border border-gray-200 overflow-y-scroll p-6"
        >
          <div>
            {/* Put the scroll bar always on the bottom */}
            <InfiniteScroll
              dataLength={messageHistory.length}
              next={fetchMessages}
              className="flex flex-col-reverse" // To put endMessage and loader to the top
              inverse={true}
              hasMore={hasMoreMessages}
              loader={<ChatLoader />}
              scrollableTarget="scrollableDiv"
              style={{ overflowY: 'hidden' }}
            >
              {messageHistory.map((message: MessageModel) => (
                <Message key={message.id} message={message} />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </ul>
      <div className="flex justify-end mt-2">
        <input
          name="message"
          placeholder="Message"
          onChange={handleChangeMessage}
          value={message}
          className="ml-2 px-1 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md"
        />
        <button className="ml-3 bg-gray-300 px-3 py-1 rounded-sm" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
