import { useEffect, useState } from "react";
import shiftApi from "../../api/shift.api";

export default function Shifts() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    shiftApi.getShifts().then(res => setShifts(res.data));
  }, []);

  return (
    <>
      <h2>Shift Management</h2>
      <ul>
        {shifts.map(s => (
          <li key={s._id}>{s.name}</li>
        ))}
      </ul>
    </>
  );
}