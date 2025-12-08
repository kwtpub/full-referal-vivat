import type { IUser } from '../IUser';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  agent?: IUser;
  agentDto?: IUser;
}
