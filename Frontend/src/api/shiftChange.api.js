import axios from "./axios";

const shiftChangeApi = {
  // User tạo yêu cầu
  createRequest: (data) =>
    axios.post("/shift-changes", data),

  // Xem danh sách (theo role backend)
  getRequests: () =>
    axios.get("/shift-changes"),

  // Admin / Manager duyệt
  approveRequest: (id) =>
    axios.put(`/shift-changes/${id}/approve`),
};

export default shiftChangeApi;