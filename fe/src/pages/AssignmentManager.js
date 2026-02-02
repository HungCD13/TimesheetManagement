import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';

const AssignmentManager = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  
  // Form State
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Gọi song song 2 API để lấy danh sách User và Shift
      const [usersRes, shiftsRes] = await Promise.all([
        axiosClient.get('/users'),
        axiosClient.get('/shifts')
      ]);
      
      setEmployees(usersRes.data);
      setShifts(shiftsRes.data);

      // Set default values nếu có dữ liệu
      if (usersRes.data.length > 0) setSelectedUser(usersRes.data[0]._id);
      if (shiftsRes.data.length > 0) setSelectedShift(shiftsRes.data[0]._id);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!selectedUser || !selectedShift || !date) {
      alert("Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    try {
      await axiosClient.post('/assignments', {
        userId: selectedUser,
        shiftId: selectedShift,
        date: date
      });
      setMessage(`✅ Đã phân ca thành công cho ngày ${moment(date).format('DD/MM/YYYY')}`);
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.response?.data?.message || 'Không thể phân ca'}`);
    }
  };

  return (
    <div className="page-container">
      <h2>📋 Quản lý Phân Ca (Gán ca cho nhân viên)</h2>
      
      {message && <div className={`alert-box ${message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}

      <div className="form-section card-box">
        <form onSubmit={handleAssign} className="assignment-form">
          
          <div className="form-group">
            <label>1. Chọn Nhân Viên:</label>
            <select 
              value={selectedUser} 
              onChange={(e) => setSelectedUser(e.target.value)}
              className="form-control"
            >
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.username} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>2. Chọn Ca Làm Việc:</label>
            <select 
              value={selectedShift} 
              onChange={(e) => setSelectedShift(e.target.value)}
              className="form-control"
            >
              {shifts.map(shift => (
                <option key={shift._id} value={shift._id}>
                  {shift.name} ({shift.startTime} - {shift.endTime})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>3. Chọn Ngày:</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn-primary mt-3">💾 Lưu Phân Ca</button>
        </form>
      </div>

      <div className="tutorial-box mt-4">
        <h4>ℹ️ Hướng dẫn:</h4>
        <p>Chọn nhân viên và ca làm việc tương ứng cho ngày cụ thể. Sau khi gán, nhân viên sẽ thấy lịch làm việc của họ trên trang Dashboard.</p>
      </div>
    </div>
  );
};

export default AssignmentManager;