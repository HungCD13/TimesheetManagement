import { create } from "zustand";
import authApi from "../api/auth.api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),

  // 🔐 LOGIN
  login: async (data) => {
    const res = await authApi.login(data);

    const { token, user } = res.data;

    localStorage.setItem("token", token);

    set({
      token,
      user,
    });
  },

  // 👤 FETCH USER TỪ TOKEN
  fetchMe: async () => {
    try {
      const token = get().token;
      if (!token) return;

      const res = await authApi.getMe();
      set({ user: res.data });
    } catch (err) {
      console.log("fetchMe failed → logout");
      get().logout();
    }
  },

  // 🚪 LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));