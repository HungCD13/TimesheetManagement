import axios from "./axios";

const assignmentApi = {
  // User / Manager / Admin
  getAssignments: () => axios.get("/assignments"),

  // Admin only
  createAssignment: (data) =>
    axios.post("/assignments", data),
};

export default assignmentApi;