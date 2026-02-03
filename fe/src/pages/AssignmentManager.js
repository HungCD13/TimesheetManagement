import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';
import { Link } from 'react-router-dom';
import '../css/AssignmentManager.css';

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
      {/* Header đồng bộ với AttendancePage */}
      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <span className="arrow">←</span> Trở về Dashboard
          </Link>
          <h2 className="page-title">Quản lý Phân Ca</h2>
        </div>
      </header>

      <div className="page-content">
        {message && <div className={`alert-box ${message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}

        <div className="section-panel form-panel">
            <div className="section-title">
                <span>📝 Thông tin phân công</span>
            </div>
            
            <div className="panel-body">
                <form onSubmit={handleAssign} className="assignment-form">
                
                <div className="form-group">
                    <label>1. Chọn Nhân Viên</label>
                    <div className="select-wrapper">
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
                </div>

                <div className="form-group">
                    <label>2. Chọn Ca Làm Việc</label>
                    <div className="select-wrapper">
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
                </div>

                <div className="form-group">
                    <label>3. Chọn Ngày</label>
                    <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="form-control"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                         Lưu Phân Ca
                    </button>
                </div>
                </form>
            </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default AssignmentManager;