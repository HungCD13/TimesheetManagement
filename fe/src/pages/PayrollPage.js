import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';

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
      setReport(res.data.data);
    } catch (err) {
      alert('Lỗi tải bảng lương');
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
      alert('Cập nhật lương thành công!');
    } catch (err) {
      alert('Lỗi cập nhật lương');
    }
  };

  // Hàm format tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="page-container">
      <h2>💰 Bảng Tính Lương Nhân Viên</h2>
      
      <div className="card-box mb-4">
        <label style={{ marginRight: '10px' }}>Chọn Tháng:</label>
        <input 
          type="month" 
          value={month} 
          onChange={(e) => setMonth(e.target.value)}
          className="form-control"
          style={{ width: '200px', display: 'inline-block' }}
        />
      </div>

      <div className="payroll-table-container card-box">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Số ca</th>
              <th>Tổng giờ làm</th>
              <th>Lương/Giờ</th>
              <th>Tổng Lương (Dự kiến)</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {report.map((row) => (
              <tr key={row.userId}>
                <td>{row.username}</td>
                <td>{row.totalShifts}</td>
                <td>{row.totalHours}h</td>
                <td>
                  {editingUser === row.userId ? (
                    <input 
                      type="number" 
                      value={newRate} 
                      onChange={(e) => setNewRate(e.target.value)}
                      style={{ width: '80px', padding: '5px' }}
                    />
                  ) : (
                    formatCurrency(row.hourlyRate) + '/h'
                  )}
                </td>
                <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                  {formatCurrency(row.totalSalary)}
                </td>
                <td>
                  {editingUser === row.userId ? (
                    <>
                      <button onClick={() => saveRate(row.userId)} className="btn-sm btn-success">Lưu</button>
                      <button onClick={() => setEditingUser(null)} className="btn-sm btn-cancel">Hủy</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditRate(row)} className="btn-sm btn-edit">Sửa Lương</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollPage;