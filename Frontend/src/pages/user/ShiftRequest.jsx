import shiftChangeApi from "../../api/shiftChange.api";

export default function ShiftRequest() {
  const submit = () => {
    shiftChangeApi.createRequest({
      reason: "Muốn đổi ca",
    });
  };

  return (
    <>
      <h2>Request Shift Change</h2>
      <button onClick={submit}>Send Request</button>
    </>
  );
}