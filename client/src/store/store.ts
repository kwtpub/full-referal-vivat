import { makeAutoObservable } from 'mobx';
import type { IUser } from '../models/IUser';
import AuthService from '../service/AuthService';
import axios from 'axios';
import type { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';

function isAxiosError(error: unknown): error is { response?: { data?: { message?: string } } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}
export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      const user = response.data.agentDto || response.data.agent;
      if (user) this.setUser(user);
    } catch (e) {
      if (isAxiosError(e)) {
        const errorMessage = e.response?.data?.message || 'Ошибка входа';
        console.error('Ошибка входа:', errorMessage);
        throw new Error(errorMessage);
      }
      throw e;
    }
  }

  async registration(name: string, email: string, password: string) {
    try {
      const response = await AuthService.registration(name, email, password);
      if (response?.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        this.setAuth(true);
        const user = response.data.agent || response.data.agentDto;
        if (user) this.setUser(user);
      } else {
        throw new Error('Ошибка получения данных от сервера');
      }
    } catch (e) {
      if (isAxiosError(e)) {
        const errorMessage = e.response?.data?.message || 'Аккаунт с такими данными уже существует';
        throw new Error(errorMessage);
      }
      throw e;
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(e.response?.data?.message);
      }
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      const user = response.data.agent || response.data.agentDto;
      if (user) this.setUser(user);
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(e.response?.data?.message);
      }
    } finally {
      this.setLoading(false);
    }
  }
}
