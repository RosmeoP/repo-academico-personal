export interface Role {
  id: number;
  name: string;
  image: string;
  route: string;
}

export interface UserResponse {
  id: number;
  name: string;
  lastName: string;
  image: string;
  email: string;
  notificaction_tokens: string | null;
  phone: number;
  roles: Role[];
}

export interface AuthResponse {
  token: string;
  userResponse: UserResponse;
}
