import { useEffect, useState } from "react";
import alertApi from "../../api/alert.api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    alertApi.getAlerts().then(res => setAlerts(res.data));
  }, []);

  return (
    <>
      <h2>My Alerts</h2>
      <ul>
        {alerts.map(a => (
          <li key={a._id}>
            {a.message}
          </li>
        ))}
      </ul>
    </>
  );
}