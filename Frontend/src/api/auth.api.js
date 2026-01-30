// src/api/auth.api.js
import axios from "./axios";

const authApi = {
  login: (data) => axios.post("/auth/login", data),
  register: (data) => axios.post("/auth/register", data),
  getMe: () => axios.get("/auth/me"),
};

export default authApi;