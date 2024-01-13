import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import default_user from "../assets/default_user.png";

interface UserResponse {
  username: string;
  name: string;
  url: string;
  email: string;
  profile_picture: string;
}

export function Conversations() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("http://127.0.0.1:8000/api/v1/user/", {
        headers: {
          Authorization: `Bearer ${user?.access}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    }
    fetchUsers();
  }, [user]);

  function createConversationName(username: string) {
    const namesAlph = [user?.user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  return (
    <div>
      <p className="pb-2">Users:</p>
      <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {users
          .filter((u) => u.username !== user?.user?.username)
          .map((u) => (
            <li className="pb-3 sm:pb-4">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={u.profile_picture ? u.profile_picture : default_user}
                    alt="Neil image"
                  />
                </div>
                <Link to={`chats/${createConversationName(u.username)}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {u.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {u.email}
                    </p>
                  </div>
                </Link>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
