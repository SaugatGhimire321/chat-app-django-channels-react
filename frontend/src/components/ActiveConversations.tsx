import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { ConversationModel } from "../models/Conversation";

export function ActiveConversations() {
  const { user } = useContext(AuthContext);
  const [conversations, setActiveConversations] = useState<ConversationModel[]>(
    []
  );

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("http://127.0.0.1:8000/api/v1/conversations/", {
        headers: {
          Authorization: `Bearer ${user?.access}`,
        },
      });
      const data = await res.json();
      setActiveConversations(data);
    }
    fetchUsers();
  }, [user]);

  function createConversationName(username: string) {
    const namesAlph = [user?.user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  function formatMessageTimestamp(created_at?: string) {
    if (!created_at) return;
    const date = new Date(created_at);
    return date.toLocaleTimeString().slice(0, 5);
  }

  return (
    <div>
      {conversations.map((c) => (
        <Link
          to={`/chats/${createConversationName(c.other_user.username)}`}
          key={c.other_user.username}
        >
          <div className="border border-gray-200 w-full p-3">
            <h3 className="text-xl font-semibold text-gray-800">
              {c.other_user.username}
            </h3>
            <div className="flex justify-between">
              <p className="text-gray-700">{c.last_message?.content}</p>
              <p className="text-gray-700">
                {formatMessageTimestamp(c.last_message?.created_at)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
