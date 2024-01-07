import { AxiosRequestHeaders } from "axios";

export default function authHeader(): AxiosRequestHeaders {
  const localStorageUser = localStorage.getItem("user");
  if (!localStorageUser) {
    return {};
  }

  const user = JSON.parse(localStorageUser);
  console.log(localStorageUser);
  if (user && user.token) {
    return { Authorization: `Token ${user.token}` };
  }
  return {};
}
