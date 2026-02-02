import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';

const AttendancePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  // 1. Lấy phân công HÔM NAY để check-in
  const fetchTodayAssignments = async () => {
    try {
      const today = moment().format('YYYY-MM-DD');
      const res = await axiosClient.get(`/assignments?date=${today}`);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Lấy lịch sử chấm công
  const fetchHistory = async () => {
    try {
      const res = await axiosClient.get('/attendance/me');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodayAssignments();
    fetchHistory();
  }, []);

  const handleCheckIn = async (assignmentId) => {
    try {
      const res = await axiosClient.post('/attendance/checkin', { assignmentId });
      setMessage(`✅ ${res.data.message}`);
      fetchHistory(); // Refresh list
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Lỗi check-in'}`);
    }
  };

  const handleCheckOut = async (assignmentId) => {
    try {
      const res = await axiosClient.post('/attendance/checkout', { assignmentId });
      setMessage(`✅ Check-out thành công. Làm việc: ${res.data.workedMinutes} phút.`);
      fetchHistory();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message}`);
    }
  };

  return (
    <div className="page-container">
      <h2>Quản lý Chấm công</h2>
      {message && <div className="alert-box">{message}</div>}

      <div className="section">
        <h3>Ca làm việc hôm nay ({moment().format('DD/MM/YYYY')})</h3>
        {assignments.length === 0 ? <p>Không có ca nào hôm nay.</p> : (
          <div className="card-list">
            {assignments.map(asg => (
              <div key={asg._id} className="card">
                <h4>{asg.shiftId.name}</h4>
                <p>⏰ {asg.shiftId.startTime} - {asg.shiftId.endTime}</p>
                <div className="actions">
                  <button onClick={() => handleCheckIn(asg._id)} className="btn-in">Check In</button>
                  <button onClick={() => handleCheckOut(asg._id)} className="btn-out">Check Out</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3>Lịch sử chấm công</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Ca</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item._id}>
                <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                <td>{item.assignmentId?.shiftId?.name || 'N/A'}</td>
                <td>{item.checkIn ? moment(item.checkIn).format('HH:mm') : '-'}</td>
                <td>{item.checkOut ? moment(item.checkOut).format('HH:mm') : '-'}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;