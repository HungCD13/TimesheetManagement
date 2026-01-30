import { useEffect, useState } from "react";
import alertApi from "../../api/alert.api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  const load = () => {
    alertApi.getAlerts().then(res => setAlerts(res.data));
  };

  useEffect(load, []);

  return (
    <>
      <h2>Alerts</h2>
      <button onClick={() => alertApi.scanAlerts().then(load)}>
        Scan Alerts
      </button>

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