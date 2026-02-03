import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';
import { Link } from 'react-router-dom';
import '../css/PayrollPage.css';

const PayrollPage = () => {
  const [report, setReport] = useState([]);
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [editingUser, setEditingUser] = useState(null);
  const [newRate, setNewRate] = useState(0);

  useEffect(() => {
    fetchPayroll();
  }, [month]);

  const fetchPayroll = async () => {
    try {
      const res = await axiosClient.get(`/payroll/report?month=${month}`);
      // Giả lập data nếu API chưa trả về đúng structure để test UI (Optional)
      setReport(res.data.data || []);
    } catch (err) {
      console.error(err);
      // alert('Lỗi tải bảng lương'); // Tạm ẩn alert để tránh spam khi dev
    }
  };

  const handleEditRate = (user) => {
    setEditingUser(user.userId);
    setNewRate(user.hourlyRate);
  };

  const saveRate = async (userId) => {
    try {
      await axiosClient.put(`/payroll/rate/${userId}`, { hourlyRate: newRate });
      setEditingUser(null);
      fetchPayroll(); // Reload lại dữ liệu
      alert('✅ Cập nhật lương thành công!');
    } catch (err) {
      alert('❌ Lỗi cập nhật lương');
    }
  };

  // Hàm format tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="page-container">
      {/* Header đồng bộ */}
      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <span className="arrow">←</span> Trở về Dashboard
          </Link>
          <h2 className="page-title">Bảng Tính Lương</h2>
        </div>
        <div className="header-right">
           <div className="month-filter-badge">
              <span className="label">Kỳ lương:</span>
              <input 
                type="month" 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                className="month-input"
              />
           </div>
        </div>
      </header>

      <div className="page-content">
        
        <div className="section-panel table-panel">
            <div className="section-title">
                <span>💰 Chi tiết lương tháng {moment(month).format('MM/YYYY')}</span>
            </div>

            <div className="table-wrapper">
                <table className="payroll-table">
                <thead>
                    <tr>
                    <th>Nhân viên</th>
                    <th className="text-center">Số ca</th>
                    <th className="text-center">Tổng giờ</th>
                    <th className="text-right">Lương/Giờ</th>
                    <th className="text-right">Tổng Lương</th>
                    <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {report.length === 0 ? (
                        <tr><td colSpan="6" className="empty-row">Chưa có dữ liệu chấm công tháng này</td></tr>
                    ) : (
                        report.map((row) => (
                        <tr key={row.userId} className={editingUser === row.userId ? 'editing-row' : ''}>
                            <td className="col-user">
                                <div className="user-info">
                                    <span className="username">{row.username}</span>
                                    <span className="user-id">#{row.userId.slice(-4)}</span>
                                </div>
                            </td>
                            <td className="text-center">{row.totalShifts}</td>
                            <td className="text-center font-mono">{row.totalHours}h</td>
                            <td className="text-right">
                            {editingUser === row.userId ? (
                                <input 
                                type="number" 
                                value={newRate} 
                                onChange={(e) => setNewRate(e.target.value)}
                                className="rate-input"
                                autoFocus
                                />
                            ) : (
                                <span className="rate-display">{formatCurrency(row.hourlyRate)}</span>
                            )}
                            </td>
                            <td className="text-right col-total">
                            {formatCurrency(row.totalSalary)}
                            </td>
                            <td className="text-center col-actions">
                            {editingUser === row.userId ? (
                                <div className="action-group">
                                <button onClick={() => saveRate(row.userId)} className="btn-icon btn-save" title="Lưu">
                                    💾
                                </button>
                                <button onClick={() => setEditingUser(null)} className="btn-icon btn-cancel" title="Hủy">
                                    ❌
                                </button>
                                </div>
                            ) : (
                                <button onClick={() => handleEditRate(row)} className="btn-sm btn-edit">
                                ✏️ Sửa
                                </button>
                            )}
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;