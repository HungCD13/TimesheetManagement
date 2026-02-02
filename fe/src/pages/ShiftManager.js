import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const ShiftManager = () => {
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', startTime: '', endTime: '', requiredHeadcount: 1
  });

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    const res = await axiosClient.get('/shifts');
    setShifts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/shifts', formData);
      alert('Tạo ca thành công!');
      loadShifts();
      setFormData({ name: '', startTime: '', endTime: '', requiredHeadcount: 1 });
    } catch (err) {
      alert('Lỗi: ' + err.response.data.message);
    }
  };

  return (
    <div className="page-container">
      <h2>Quản lý Ca làm việc (Admin)</h2>
      
      <div className="form-section">
        <h3>Tạo ca mới</h3>
        <form onSubmit={handleSubmit} className="inline-form">
          <input placeholder="Tên ca (Sáng/Chiều)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
          <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
          <input type="number" placeholder="Số người" value={formData.requiredHeadcount} onChange={e => setFormData({...formData, requiredHeadcount: e.target.value})} />
          <button type="submit">Lưu</button>
        </form>
      </div>

      <div className="list-section">
        <h3>Danh sách ca hiện có</h3>
        <ul>
          {shifts.map(shift => (
            <li key={shift._id}>
              <b>{shift.name}</b>: {shift.startTime} - {shift.endTime} (Cần {shift.requiredHeadcount} người)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShiftManager;