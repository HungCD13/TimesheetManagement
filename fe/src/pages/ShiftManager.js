import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';
import '../css/ShiftManager.css';

const ShiftManager = () => {
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', startTime: '', endTime: '', requiredHeadcount: 1
  });

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    try {
      const res = await axiosClient.get('/shifts');
      setShifts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/shifts', formData);
      alert('✅ Tạo ca thành công!');
      loadShifts();
      setFormData({ name: '', startTime: '', endTime: '', requiredHeadcount: 1 });
    } catch (err) {
      alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể tạo ca'));
    }
  };

  return (
    <div className="page-container">
      {/* Header đồng bộ */}
      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <span className="arrow">←</span> Trở về Dashboard
          </Link>
          <h2 className="page-title">Quản lý Ca Làm Việc</h2>
        </div>
        <div className="header-right">
             <span className="badge-admin">Admin Zone</span>
        </div>
      </header>

      <div className="page-content">
        
        {/* Form Tạo Ca */}
        <div className="section-panel form-panel">
            <div className="section-title">
                <span>➕ Tạo ca mới</span>
            </div>
            <div className="panel-body">
                <form onSubmit={handleSubmit} className="shift-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên ca</label>
                            <input 
                                className="form-control"
                                placeholder="VD: Ca Sáng" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Bắt đầu</label>
                            <input 
                                type="time" 
                                className="form-control"
                                value={formData.startTime} 
                                onChange={e => setFormData({...formData, startTime: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Kết thúc</label>
                            <input 
                                type="time" 
                                className="form-control"
                                value={formData.endTime} 
                                onChange={e => setFormData({...formData, endTime: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Nhân sự (người)</label>
                            <input 
                                type="number" 
                                className="form-control"
                                placeholder="Số lượng" 
                                value={formData.requiredHeadcount} 
                                onChange={e => setFormData({...formData, requiredHeadcount: e.target.value})} 
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            Lưu Ca Mới
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Danh sách Ca */}
        <div className="list-section">
            <h3 className="list-title">Danh sách ca hiện có ({shifts.length})</h3>
            <div className="shifts-grid">
                {shifts.map(shift => (
                    <div key={shift._id} className="shift-card-admin">
                        <div className="card-header-admin">
                            <h4>{shift.name}</h4>
                            <span className="headcount-badge">👥 {shift.requiredHeadcount}</span>
                        </div>
                        <div className="card-body-admin">
                            <div className="time-row">
                                <span className="time-val">{shift.startTime}</span>
                                <span className="arrow">➝</span>
                                <span className="time-val">{shift.endTime}</span>
                            </div>
                        </div>
                        {/* Có thể thêm nút sửa/xóa ở đây nếu cần */}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ShiftManager;