import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * LƯU Ý CHO DỰ ÁN THỰC TẾ:
 * Bạn nên import axiosClient từ file config của bạn:
 * import axiosClient from '../api/axiosClient';
 * * Ở đây tôi định nghĩa lại ngay trong file để đảm bảo bản Preview có thể chạy được.
 */

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor gắn token (giống hệt file bạn cung cấp)
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Hàm helper định dạng ngày tháng (thay thế cho moment)
  const formatDate = (date, formatType) => {
    const d = new Date(date || new Date());
    if (isNaN(d.getTime())) return '--:--';

    if (formatType === 'YYYY-MM-DD') return d.toISOString().split('T')[0];
    if (formatType === 'DD/MM/YYYY') return d.toLocaleDateString('vi-VN');
    if (formatType === 'DD/MM') return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    if (formatType === 'HH:mm') return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    return d.toString();
  };

  // 1. Lấy phân công HÔM NAY bằng axiosClient
  const fetchTodayAssignments = async () => {
    try {
      const today = formatDate(new Date(), 'YYYY-MM-DD');
      const res = await axiosClient.get(`/assignments?date=${today}`);
      setAssignments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy phân công:", err);
    }
  };

  // 2. Lấy lịch sử chấm công bằng axiosClient
  const fetchHistory = async () => {
    try {
      const res = await axiosClient.get('/attendance/me');
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy lịch sử:", err);
    }
  };

  useEffect(() => {
    fetchTodayAssignments();
    fetchHistory();
  }, []);

  const handleCheckIn = async (assignmentId) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/attendance/checkin', { assignmentId });
      setMessage(`✅ ${res.data?.message || 'Check-in thành công'}`);
      fetchHistory();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Lỗi check-in'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (assignmentId) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/attendance/checkout', { assignmentId });
      const worked = res.data?.workedMinutes || 0;
      setMessage(`✅ Check-out thành công. Làm việc: ${worked} phút.`);
      fetchHistory();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Lỗi check-out'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page-container">
      <style>{`
        .attendance-page-container { font-family: -apple-system, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto; background: #f9fafb; min-height: 100vh; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .back-link { text-decoration: none; color: #6366f1; font-weight: 500; font-size: 0.9rem; }
        .page-title { margin: 8px 0 0 0; color: #1f2937; font-size: 1.5rem; }
        .date-badge { background: #eef2ff; padding: 6px 12px; border-radius: 20px; border: 1px solid #e0e7ff; }
        .date-badge .label { color: #4f46e5; font-size: 0.8rem; margin-right: 5px; }
        .date-badge .value { font-weight: 600; color: #3730a3; }
        .alert-box { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .alert-box.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .alert-box.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .content-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; }
        @media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }
        .section-panel { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .section-title { margin-top: 0; margin-bottom: 20px; font-size: 1.1rem; color: #374151; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
        .shift-card { border: 1px solid #f3f4f6; padding: 15px; border-radius: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .shift-info h4 { margin: 0 0 5px 0; color: #111827; }
        .time-range { margin: 0; font-size: 0.85rem; color: #6b7280; background: #f3f4f6; padding: 2px 8px; border-radius: 4px; }
        .shift-actions { display: flex; gap: 8px; }
        .btn { padding: 8px 14px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.8rem; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-checkin { background: #10b981; color: white; }
        .btn-checkout { background: #ef4444; color: white; }
        .table-wrapper { overflow-x: auto; }
        .compact-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .compact-table th { text-align: left; padding: 10px; border-bottom: 2px solid #f3f4f6; color: #6b7280; }
        .compact-table td { padding: 10px; border-bottom: 1px solid #f3f4f6; }
        .status-tag { padding: 3px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
        .status-tag.present { background: #d1fae5; color: #065f46; }
        .status-tag.late { background: #fef3c7; color: #92400e; }
        .empty-state { text-align: center; color: #9ca3af; padding: 30px 0; font-style: italic; }
      `}</style>

      <header className="page-header">
        <div className="header-left">
          <a href="/" className="back-link">← Dashboard</a>
          <h2 className="page-title">Quản lý Chấm công</h2>
        </div>
        <div className="header-right">
          <div className="date-badge">
            <span className="label">Hôm nay:</span>
            <span className="value">{formatDate(new Date(), 'DD/MM/YYYY')}</span>
          </div>
        </div>
      </header>

      <div className="page-content">
        {message && (
          <div className={`alert-box ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="content-grid">
          <section className="section-panel">
            <h3 className="section-title">📅 Ca làm việc hôm nay</h3>
            {assignments.length === 0 ? (
              <div className="empty-state">Không có ca làm việc.</div>
            ) : (
              assignments.map(asg => (
                <div key={asg._id} className="shift-card">
                  <div className="shift-info">
                    <h4>{asg.shiftId?.name || 'Ca không xác định'}</h4>
                    <p className="time-range">
                      {asg.shiftId?.startTime || '--'} - {asg.shiftId?.endTime || '--'}
                    </p>
                  </div>
                  <div className="shift-actions">
                    <button onClick={() => handleCheckIn(asg._id)} className="btn btn-checkin" disabled={loading}>
                      In
                    </button>
                    <button onClick={() => handleCheckOut(asg._id)} className="btn btn-checkout" disabled={loading}>
                      Out
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="section-panel">
            <h3 className="section-title">🕒 Lịch sử chấm công</h3>
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
                  {history.length === 0 ? (
                    <tr><td colSpan="5" className="empty-state">Chưa có dữ liệu.</td></tr>
                  ) : (
                    history.map(item => (
                      <tr key={item._id}>
                        <td>{formatDate(item.createdAt, 'DD/MM')}</td>
                        <td>{item.assignmentId?.shiftId?.name || 'N/A'}</td>
                        <td>{item.checkIn ? formatDate(item.checkIn, 'HH:mm') : '--'}</td>
                        <td>{item.checkOut ? formatDate(item.checkOut, 'HH:mm') : '--'}</td>
                        <td>
                          <span className={`status-tag ${item.status || 'unknown'}`}>
                            {item.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;