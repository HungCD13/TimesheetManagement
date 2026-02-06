import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- [PHẦN CẤU HÌNH CHO DỰ ÁN THỰC TẾ] ---
// Khi copy vào dự án, hãy BỎ COMMENT 2 dòng này và XÓA phần "PREVIEW HELPER" bên dưới
// import axiosClient from '../api/axiosClient';
// import '../css/PayrollPage.css';

// --- [PREVIEW HELPER - XÓA PHẦN NÀY KHI CHẠY Ở PROJECT THẬT] ---
// Giả lập axiosClient để gọi API THẬT (localhost:3000) mà không cần file import
const axiosClient = {
  get: async (url) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api${url}`, {
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) 
      }
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  },
  put: async (url, body) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api${url}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) 
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  }
};
// ----------------------------------------------------------------

const PayrollPage = () => {
  const [report, setReport] = useState([]);
  // Lấy tháng hiện tại định dạng YYYY-MM
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editingUser, setEditingUser] = useState(null);
  const [newRate, setNewRate] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayroll();
  }, [month]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      // Gọi API thật qua axiosClient (đã có base URL & Token)
      const res = await axiosClient.get(`/payroll/report?month=${month}`);
      setReport(res.data.data || []);
    } catch (err) {
      console.error("Lỗi tải bảng lương:", err);
      // alert('Không thể tải dữ liệu lương'); 
    } finally {
      setLoading(false);
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
      fetchPayroll(); // Reload lại dữ liệu sau khi sửa
      alert('✅ Cập nhật lương thành công!');
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi cập nhật lương');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr) => {
      if(!dateStr) return '';
      const [year, month] = dateStr.split('-');
      return `${month}/${year}`;
  };

  const exportToExcel = () => {
    if (report.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const headers = [
      "Mã NV",
      "Họ và Tên", // Header hiển thị Họ Tên
      "Ngân hàng",
      "Số ca",
      "Tổng giờ",
      "Tăng ca (h)",
      "Lương/Giờ",
      "Tổng Lương"
    ];

    const rows = report.map(row => [
      `"${row.userId.slice(-4)}"`,
      `"${row.fullname}"`, // Lấy fullname xuất Excel
      `"${row.bank || ''}"`,
      row.totalShifts,
      String(row.totalHours).replace('.', ','),
      String(row.totalOvertimeHours).replace('.', ','),
      row.hourlyRate,
      row.totalSalary
    ]);

    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bang_Luong_Thang_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      {/* CSS EMBEDDED FOR PREVIEW - Xóa khi dùng thật */}
      <style>{`
        .page-container {
            --primary: #4f46e5; --bg-page: #f8fafc; --text-main: #0f172a; --text-sub: #64748b;
            --border: #e2e8f0; --success: #10b981; --danger: #ef4444;
            font-family: 'Inter', sans-serif; background-color: var(--bg-page);
            min-height: 100vh; display: flex; flex-direction: column;
        }
        .page-header {
            background: #fff; padding: 1.25rem 2rem; max-width: 1200px; width: calc(100% - 2rem);
            margin: 1.5rem auto 2rem auto; border-radius: 16px; border: 1px solid var(--border);
            border-top: 4px solid var(--success); display: flex; justify-content: space-between;
            align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .page-title { margin: 0; font-size: 1.75rem; color: var(--text-main); font-weight: 800; }
        .back-link { text-decoration: none; color: var(--text-sub); font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; }
        .back-link:hover { color: var(--primary); }
        .header-actions { display: flex; gap: 15px; align-items: center; }
        .month-filter-badge { display: flex; align-items: center; gap: 8px; background: #f1f5f9; padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border); }
        .month-filter-badge .label { font-weight: 600; font-size: 0.9rem; color: #475569; }
        .month-input { border: none; background: transparent; font-weight: bold; color: #0f172a; outline: none; cursor: pointer; font-family: inherit; font-size: 0.95rem; }
        .btn-excel { padding: 8px 16px; background: var(--success); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .btn-excel:hover { background: #059669; transform: translateY(-1px); }
        .page-content { max-width: 1200px; margin: 0 auto; width: calc(100% - 2rem); padding-bottom: 3rem; }
        .section-panel { background: #fff; border-radius: 16px; border: 1px solid var(--border); overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .section-title { padding: 1rem 1.5rem; background: linear-gradient(to right, #f8fafc, #fff); font-weight: 700; border-bottom: 1px solid var(--border); color: #334155; }
        .table-wrapper { overflow-x: auto; }
        .payroll-table { width: 100%; border-collapse: collapse; min-width: 900px; }
        .payroll-table th { background: #f8fafc; padding: 1rem; text-align: left; font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
        .payroll-table td { padding: 1rem; border-bottom: 1px solid #f1f5f9; color: var(--text-main); vertical-align: middle; }
        .payroll-table tr:hover { background-color: #f8fafc; }
        .editing-row { background-color: #ecfdf5 !important; }
        .user-info .fullname { font-weight: 700; display: block; color: #0f172a; margin-bottom: 2px; }
        .user-info .sub-info { font-size: 0.85rem; color: #64748b; }
        .col-bank { font-size: 0.9rem; color: #334155; }
        .text-muted { color: #94a3b8; font-style: italic; }
        .font-mono { font-family: 'Consolas', monospace; color: #6366f1; font-weight: 600; }
        .ot-badge { display: block; color: var(--danger); font-weight: 700; font-size: 0.75rem; margin-top: 2px; }
        .rate-input { padding: 6px; width: 100px; text-align: right; border: 2px solid var(--success); border-radius: 6px; outline: none; font-weight: 600; font-family: inherit; }
        .col-total { font-weight: 700; color: var(--success); font-size: 1rem; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .btn-sm { padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border); background: white; cursor: pointer; font-weight: 500; font-size: 0.85rem; }
        .btn-edit:hover { background: #f8fafc; border-color: #cbd5e1; color: var(--primary); }
        .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; margin: 0 4px; }
        .btn-save { background: var(--success); color: white; }
        .btn-cancel { background: var(--danger); color: white; }
        .action-group { display: flex; justify-content: center; }
        .loading-row, .empty-row { text-align: center; padding: 3rem; color: #94a3b8; font-style: italic; }
      `}</style>

      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <span className="arrow">←</span> Trở về Dashboard
          </Link>
          <h2 className="page-title">Bảng Tính Lương</h2>
        </div>
        <div className="header-right">
           <div className="header-actions">
             <button
                onClick={exportToExcel}
                className="btn-excel"
             >
                📥 Xuất Excel
             </button>

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
        </div>
      </header>

      <div className="page-content">
        <div className="section-panel table-panel">
            <div className="section-title">
                <span>💰 Chi tiết lương tháng {formatDate(month)}</span>
            </div>

            <div className="table-wrapper">
                <table className="payroll-table">
                <thead>
                    <tr>
                    <th style={{width: '25%'}}>Họ và Tên</th>
                    <th style={{width: '20%'}}>Ngân hàng</th>
                    <th className="text-center">Số ca</th>
                    <th className="text-center">Tổng giờ</th>
                    <th className="text-right">Lương/Giờ</th>
                    <th className="text-right">Tổng Lương</th>
                    <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="7" className="loading-row">Đang tải dữ liệu...</td></tr>
                    ) : report.length === 0 ? (
                        <tr><td colSpan="7" className="empty-row">Chưa có dữ liệu chấm công tháng này</td></tr>
                    ) : (
                        report.map((row) => (
                        <tr key={row.userId} className={editingUser === row.userId ? 'editing-row' : ''}>
                            {/* Cột Họ Tên: Chỉ hiện Fullname */}
                            <td className="col-user">
                                <div className="user-info">
                                    <span className="fullname">{row.fullname}</span>
                                    <div className="sub-info">
                                      {/* Chỉ hiện ID nhỏ để tham chiếu, bỏ username */}
                                      <span className="user-id">#{row.userId.slice(-4)}</span>
                                    </div>
                                </div>
                            </td>

                            {/* Cột Bank: Đảm bảo hiển thị dữ liệu */}
                            <td className="col-bank">
                                {row.bank ? (
                                    <span style={{fontWeight: 500}}>{row.bank}</span>
                                ) : (
                                    <span className="text-muted">---</span>
                                )}
                            </td>

                            <td className="text-center">{row.totalShifts}</td>

                            <td className="text-center font-mono">
                                <div>{row.totalHours}h</div>
                                {parseFloat(row.totalOvertimeHours) > 0 && (
                                    <small className="ot-badge">+{row.totalOvertimeHours}h OT</small>
                                )}
                            </td>

                            <td className="text-right">
                            {editingUser === row.userId ? (
                                <input
                                type="number"
                                value={newRate}
                                onChange={(e) => setNewRate(e.target.value)}
                                className="rate-input"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveRate(row.userId);
                                    if (e.key === 'Escape') setEditingUser(null);
                                }}
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