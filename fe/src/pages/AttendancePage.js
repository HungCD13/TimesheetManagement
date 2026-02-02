import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';
import { Link } from 'react-router-dom'; // Import Link
import '../css/AttendancePage.css';

const AttendancePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  // 1. Lấy phân công HÔM NAY
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
      fetchHistory();
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
    <div className="attendance-page-container">
      {/* Header mới chi tiết */}
      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <span className="arrow">←</span> Trở về Dashboard
          </Link>
          <h2 className="page-title">Quản lý Chấm công</h2>
        </div>
        <div className="header-right">
          <div className="date-badge">
            <span className="label">Hôm nay:</span>
            <span className="value">{moment().format('DD/MM/YYYY')}</span>
          </div>
        </div>
      </header>

      <div className="page-content">
        {message && (
          <div className={`alert-box ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Layout chia 2 cột nếu màn hình to, hoặc dọc nếu nhỏ */}
        <div className="content-grid">
          
          {/* Cột trái: Ca làm việc hôm nay */}
          <section className="section-panel assignment-panel">
            <h3 className="section-title">📅 Ca làm việc hôm nay</h3>
            {assignments.length === 0 ? (
              <div className="empty-state">Không có ca làm việc nào hôm nay.</div>
            ) : (
              <div className="card-list">
                {assignments.map(asg => (
                  <div key={asg._id} className="shift-card">
                    <div className="shift-info">
                      <h4>{asg.shiftId.name}</h4>
                      <p className="time-range">
                        {asg.shiftId.startTime} - {asg.shiftId.endTime}
                      </p>
                    </div>
                    <div className="shift-actions">
                      <button onClick={() => handleCheckIn(asg._id)} className="btn btn-checkin">
                        Check In
                      </button>
                      <button onClick={() => handleCheckOut(asg._id)} className="btn btn-checkout">
                        Check Out
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Cột phải: Lịch sử */}
          <section className="section-panel history-panel">
            <h3 className="section-title">🕒 Lịch sử chấm công gần đây</h3>
            <div className="table-wrapper">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Ca</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item._id}>
                      <td className="col-date">{moment(item.createdAt).format('DD/MM')}</td>
                      <td className="col-shift">{item.assignmentId?.shiftId?.name || '-'}</td>
                      <td className="col-time in">{item.checkIn ? moment(item.checkIn).format('HH:mm') : '--:--'}</td>
                      <td className="col-time out">{item.checkOut ? moment(item.checkOut).format('HH:mm') : '--:--'}</td>
                      <td>
                        <span className={`status-tag ${item.status || 'unknown'}`}>
                          {item.status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AttendancePage;