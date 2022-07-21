import IToken from "./IToken";
import IUser from "./IUser";

export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  token: IToken;
  user: IUser;
}

export type UpdateUserResponse = {
  user: IUser;
}

export type GetUserResponse = {
  user: IUser;
}