import { useEffect, useState } from "react";
import attendanceApi from "../../api/attendance.api";

export default function Attendance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    attendanceApi.getAllAttendance().then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <>
      <h2>All Attendance</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>
        <tbody>
          {data.map(a => (
            <tr key={a._id}>
              <td>{a.user?.name}</td>
              <td>{a.date}</td>
              <td>{a.checkIn}</td>
              <td>{a.checkOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}