import axios from "axios";

import { UserModel } from "../models/User";

class AuthService {
  setUserInLocalStorage(data: UserModel) {
    localStorage.setItem("user", JSON.stringify(data));
  }
  async Login(email: string, password: string): Promise<UserModel> {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/user/get-token/",
      {
        email,
        password,
      }
    );
    console.log(response.data.access);
    if (!response.data.access) {
      return response.data;
    }
    this.setUserInLocalStorage(response.data);
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user")!;
    return JSON.parse(user);
  }
}

export default new AuthService();
