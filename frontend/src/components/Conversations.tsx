import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

interface UserResponse {
    email: string;
    name: string;
    url: string;
}

export function Conversations() {
    const {user} = useContext(AuthContext);
    const [users, setUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch("http://127.0.0.1:8000/api/users/", {
                headers: {
                    Authorization: `Token ${user?.access}`
                }
            })
        }
    })
}