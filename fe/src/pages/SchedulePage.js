import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';
import { AuthContext } from '../context/AuthContext';

const SchedulePage = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [viewDate, setViewDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    fetchSchedule();
  }, [viewDate]);

  const fetchSchedule = async () => {
    try {
      // Gọi API lấy assignments (Backend đã có API này lọc theo ngày)
      // Ở đây ta gọi API lấy danh sách, nhưng cần Backend hỗ trợ lấy theo khoảng thời gian (Range)
      // Để đơn giản, ta tái sử dụng API get assignments theo ngày, hoặc bạn có thể viết thêm API getRange
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
      <h2>📅 Lịch làm việc của tôi</h2>

      <div className="date-navigator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px' }}>
        <button onClick={handlePrevDay}>&lt; Ngày trước</button>
        <h3 style={{ margin: 0 }}>{moment(viewDate).format('DD/MM/YYYY')}</h3>
        <button onClick={handleNextDay}>Ngày sau &gt;</button>
      </div>

      <div className="schedule-list">
        {assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Không có ca làm việc nào trong ngày này.</div>
        ) : (
          assignments.map(asg => (
            <div key={asg._id} className="card-box" style={{ marginBottom: '15px', borderLeft: '5px solid #007bff' }}>
              <h3>{asg.shiftId?.name}</h3>
              <p>⏰ Thời gian: <b>{asg.shiftId?.startTime} - {asg.shiftId?.endTime}</b></p>
              <p>📍 Trạng thái: 
                <span className={`status-badge ${asg.status}`} style={{ marginLeft: '10px' }}>
                  {asg.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SchedulePage;