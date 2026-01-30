import { useEffect, useState } from "react";
import assignmentApi from "../../api/assignment.api";

export default function Assignments() {
  const [list, setList] = useState([]);

  useEffect(() => {
    assignmentApi.getAssignments().then(res => setList(res.data));
  }, []);

  return (
    <>
      <h2>My Assignments</h2>
      <ul>
        {list.map(a => (
          <li key={a._id}>
            {a.shift?.name} - {a.date}
          </li>
        ))}
      </ul>
    </>
  );
}