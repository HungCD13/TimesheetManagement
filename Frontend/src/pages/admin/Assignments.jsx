import { useEffect, useState } from "react";
import assignmentApi from "../../api/assignment.api";

export default function Assignments() {
  const [list, setList] = useState([]);

  useEffect(() => {
    assignmentApi.getAssignments().then(res => setList(res.data));
  }, []);

  return (
    <>
      <h2>Assignments</h2>
      <ul>
        {list.map(a => (
          <li key={a._id}>
            {a.user?.name} - {a.shift?.name} - {a.date}
          </li>
        ))}
      </ul>
    </>
  );
}