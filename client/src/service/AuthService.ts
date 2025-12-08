import $api from '../http';
import type { AuthResponse } from '../models/response/AuthResponse';
export default class AuthService {

  static async login(email: string, password: string) {
    return $api.post<AuthResponse>('/login', { email, password });
  }

  static async registration(
    username: string, 
    email: string,
    password: string,
  ) {
    return $api.post<AuthResponse>('/registration', {
      name: username,
      email,
      password,
    });
  }

  static async logout() {
    return $api.post('/logout');
  }
}
