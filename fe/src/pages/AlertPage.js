import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';
import { Link } from 'react-router-dom';
import '../css/AlertPage.css';

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [stats, setStats] = useState({ late: 0, absent: 0 });
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false); // State cho nút Scan
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, [date]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      // GỌI API ALERT CHUẨN (/alerts) với param date
      const res = await axiosClient.get(`/alerts?date=${date}`);
      
      const data = Array.isArray(res.data) ? res.data : [];
      setAlerts(data);
      
      // Tính toán thống kê từ dữ liệu thật
      const lateCount = data.filter(a => a.type === 'late').length;
      const absentCount = data.filter(a => a.type === 'absent').length;
      setStats({ late: lateCount, absent: absentCount });

    } catch (err) {
      console.error("Lỗi tải cảnh báo:", err);
      setError('Không thể kết nối đến máy chủ hoặc chưa có dữ liệu.');
      setAlerts([]);
      setStats({ late: 0, absent: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Hàm chạy scan thủ công (Gọi endpoint /scan trong backend code)
  const handleManualScan = async () => {
      try {
          setScanning(true);
          // Gọi POST /alerts/scan
          await axiosClient.post('/alerts/scan');
          
          // Sau khi scan xong thì load lại list để thấy alert mới
          await fetchAlerts();
          alert('✅ Quét dữ liệu hoàn tất!');
      } catch (err) {
          alert('❌ Lỗi khi quét dữ liệu: ' + (err.response?.data?.message || err.message));
      } finally {
          setScanning(false);
      }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <span className="arrow">←</span> Trở về Dashboard
          </Link>
          <h2 className="page-title">Cảnh Báo Vi Phạm</h2>
        </div>
        <div className="header-right">
             {/* Nút Scan thủ công */}
             <button 
                onClick={handleManualScan} 
                className="scan-btn" 
                disabled={scanning || loading} 
                style={{
                    marginRight: '10px', 
                    padding: '8px 16px', 
                    cursor: scanning ? 'not-allowed' : 'pointer', 
                    background: scanning ? '#9ca3af' : '#4f46e5', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'background 0.2s'
                }}
             >
                {scanning ? '🔄 Đang quét...' : '⚡ Quét Ngay'}
             </button>

             <div className="date-filter-wrapper">
                <span className="label">Ngày:</span>
                <input 
                    type="date" 
                    className="date-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
             </div>
        </div>
      </header>

      <div className="page-content">
        
        {/* Thống kê nhanh */}
        <div className="stats-grid">
            <div className="stat-card late">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                    <span className="stat-value">{stats.late}</span>
                    <span className="stat-label">Đi Muộn</span>
                </div>
            </div>
            <div className="stat-card absent">
                <div className="stat-icon">🚫</div>
                <div className="stat-info">
                    <span className="stat-value">{stats.absent}</span>
                    <span className="stat-label">Vắng Mặt</span>
                </div>
            </div>
        </div>

        {/* Danh sách cảnh báo */}
        <div className="section-panel">
            <div className="section-title">
                <span>📋 Danh sách chi tiết</span>
            </div>
            <div className="alerts-list">
                {loading ? (
                    <div className="empty-state">
                        <p>⏳ Đang tải dữ liệu...</p>
                    </div>
                ) : error ? (
                    <div className="empty-state" style={{ color: 'var(--color-absent)' }}>
                        <p>❌ {error}</p>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="empty-state">
                        <p>🎉 Tuyệt vời! Không có vi phạm nào trong ngày này.</p>
                    </div>
                ) : (
                    alerts.map(item => (
                        <div key={item._id} className={`alert-card ${item.type}`}>
                            <div className="card-left-strip"></div>
                            <div className="alert-content">
                                <div className="user-section">
                                    <div className="avatar-placeholder">
                                        {/* Fallback hiển thị chữ cái đầu nếu có username */}
                                        {item.employee?.username?.charAt(0) || '?'}
                                    </div>
                                    <div className="user-details">
                                        <h4>{item.employee?.username || 'Unknown User'}</h4>
                                        <span className="user-id">
                                            {/* Hiển thị ID hoặc Email */}
                                            {item.employee?.email || `#${item.employee?._id?.slice(-4) || '---'}`}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="violation-info">
                                    <div className="shift-info">
                                        <span className="icon">📅</span> {item.shift || 'Không xác định'}
                                    </div>
                                    <div className="time-info">
                                        {item.type === 'late' ? (
                                            <>
                                                <span className="highlight-late">Đến lúc: {item.checkIn || '--:--'}</span>
                                                <span className="late-amount">(Trễ {item.minutesLate} phút)</span>
                                            </>
                                        ) : (
                                            <span className="highlight-absent">Không Check-in</span>
                                        )}
                                    </div>
                                </div>

                                <div className="status-badge-wrapper">
                                    <span className={`status-badge ${item.type}`}>
                                        {item.type === 'late' ? 'Đi Muộn' : 'Vắng Mặt'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AlertPage;