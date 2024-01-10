interface abstractUser {
  id: string;
  full_name?: string;
  email: string;
  gender?: string;
  phone_number: string;
  created_at: string;
  is_staff: boolean;
  last_login: string;
  profile_picture?: string;
  username: string;
}

export interface UserModel {
  email: string;
  token: string;
  access: string;
  username: string;
  user: abstractUser;
}
