import { useEffect, useState } from "react";
import shiftChangeApi from "../../api/shiftChange.api";

export default function ShiftRequests() {
  const [list, setList] = useState([]);

  useEffect(() => {
    shiftChangeApi.getRequests().then(res => setList(res.data));
  }, []);

  const approve = async (id) => {
    await shiftChangeApi.approveRequest(id);
    setList(list.filter(i => i._id !== id));
  };

  return (
    <>
      <h2>Shift Change Requests</h2>
      {list.map(r => (
        <div key={r._id}>
          {r.user?.name} → {r.reason}
          <button onClick={() => approve(r._id)}>Approve</button>
        </div>
      ))}
    </>
  );
}