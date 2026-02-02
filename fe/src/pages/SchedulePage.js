import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../css/SchedulePage.css';

const SchedulePage = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [viewDate, setViewDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    fetchSchedule();
  }, [viewDate]);

  const fetchSchedule = async () => {
    try {
      const res = await axiosClient.get(`/assignments?date=${viewDate}`);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextDay = () => setViewDate(moment(viewDate).add(1, 'days').format('YYYY-MM-DD'));
  const handlePrevDay = () => setViewDate(moment(viewDate).subtract(1, 'days').format('YYYY-MM-DD'));

  return (
    <div className="page-container">
      {/* Header đồng bộ */}
      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <span className="arrow">←</span> Trở về Dashboard
          </Link>
          <h2 className="page-title">Lịch làm việc của tôi</h2>
        </div>
      
      </header>

      <div className="page-content">
        
        {/* Bộ điều hướng ngày */}
        <div className="date-navigator card-box">
            <button onClick={handlePrevDay} className="nav-btn">
                ← Ngày trước
            </button>
            <div className="date-display">
                <span className="day-name">{moment(viewDate).format('dddd')}</span>
                <span className="full-date">{moment(viewDate).format('DD/MM/YYYY')}</span>
            </div>
            <button onClick={handleNextDay} className="nav-btn">
                Ngày sau →
            </button>
        </div>

        {/* Danh sách ca làm việc */}
        <div className="schedule-list">
          {assignments.length === 0 ? (
            <div className="empty-schedule-state">
                <div className="icon">📅</div>
                <p>Không có ca làm việc nào trong ngày này.</p>
                <span className="sub-text">Hãy tận hưởng ngày nghỉ của bạn!</span>
            </div>
          ) : (
            assignments.map(asg => (
              <div key={asg._id} className="schedule-card">
                <div className="card-left">
                    <div className="shift-time">
                        <span className="time-start">{asg.shiftId?.startTime}</span>
                        <span className="separator">↓</span>
                        <span className="time-end">{asg.shiftId?.endTime}</span>
                    </div>
                </div>
                <div className="card-center">
                    <h3>{asg.shiftId?.name}</h3>
                    <div className="card-meta">
                        <span className="meta-item">📍 Chi nhánh chính</span>
                        {/* Ví dụ thêm thông tin khác nếu có */}
                    </div>
                </div>
                <div className="card-right">
                   <span className="status-label">Trạng thái:</span>
                   <span className={`status-badge ${asg.status || 'unknown'}`}>
                      {asg.status || 'Chưa Check-in'}
                   </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;