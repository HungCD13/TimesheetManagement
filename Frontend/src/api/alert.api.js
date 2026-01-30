import axios from "./axios";

const alertApi = {
  // Xem alerts
  getAlerts: () => axios.get("/alerts"),

  // Admin / Manager scan thủ công
  scanAlerts: () => axios.post("/alerts/scan"),

  // Đánh dấu đã đọc
  markAsRead: (id) =>
    axios.post(`/alerts/${id}/read`),
};

export default alertApi;