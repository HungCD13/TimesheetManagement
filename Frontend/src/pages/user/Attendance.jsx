import { useEffect, useState } from "react";
import assignmentApi from "../../api/assignment.api";
import attendanceApi from "../../api/attendance.api";

export default function Attendance() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    assignmentApi.getAssignments().then(res => {
      setAssignments(res.data);
    });
  }, []);

  const handleCheckIn = async (id) => {
    try {
      await attendanceApi.checkIn(id);
      alert("Check-in thành công");
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await attendanceApi.checkOut(id);
      alert("Check-out thành công");
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  return (
    <>
      <h2>My Assignments Today</h2>

      {assignments.map(a => (
        <div
          key={a._id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <p><b>Shift:</b> {a.shiftId?.name}</p>
          <p><b>Date:</b> {a.date}</p>
          <p><b>Status:</b> {a.status}</p>

          <button onClick={() => handleCheckIn(a._id)}>
            Check In
          </button>

          <button
            onClick={() => handleCheckOut(a._id)}
            style={{ marginLeft: 10 }}
          >
            Check Out
          </button>
        </div>
      ))}
    </>
  );
}