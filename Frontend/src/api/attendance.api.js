// src/api/attendance.api.js
import axios from "./axios";

const attendanceApi = {
  checkIn: (assignmentId) =>
    axios.post("/attendance/checkin", { assignmentId }),

  checkOut: (assignmentId) =>
    axios.post("/attendance/checkout", { assignmentId }),

  getMyAttendance: () =>
    axios.get("/attendance/me"),

  getAllAttendance: () =>
    axios.get("/attendance"),
};

export default attendanceApi;