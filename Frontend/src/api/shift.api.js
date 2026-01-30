import axios from "./axios";

const shiftApi = {
  getShifts: () => axios.get("/shifts"),

  // Admin only
  createShift: (data) =>
    axios.post("/shifts", data),

  updateShift: (id, data) =>
    axios.put(`/shifts/${id}`, data),
};

export default shiftApi;