import { UserModel } from "./User";

export interface MessageModel {
  id: string;
  room: string;
  from_user: UserModel;
  to_user: UserModel;
  content: string;
  created_at: string;
  read: boolean;
}
