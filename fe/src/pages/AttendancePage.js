import React, { useEffect, useMemo, useState } from 'react';
import axiosClient from '../api/axiosClient';
import moment from 'moment';

export default function AttendancePage() {
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // map status -> tiếng Việt
  const STATUS_LABEL = {
    on_time: 'Đúng giờ',
    late: 'Đi trễ',
    early_leave: 'Về sớm',
    invalid: 'Không hợp lệ',
    checked_in: 'Đã check-in'
  };

  const fmtTime = (t) => (t ? moment(t).format('HH:mm') : '—');
  const fmtDate = (t) => (t ? moment(t).format('DD/MM/YYYY') : '—');

  const fetchTodayAssignments = async () => {
    try {
      const today = moment().format('YYYY-MM-DD');
      const res = await axiosClient.get(`/assignments?date=${today}`);
      setAssignments(res.data || []);
    } catch (err) {
      console.error('fetchTodayAssignments', err);
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Lỗi khi lấy phân công' });
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axiosClient.get('/attendance/me');
      setHistory(res.data || []);
    } catch (err) {
      console.error('fetchHistory', err);
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Lỗi khi lấy lịch sử chấm công' });
    }
  };

  useEffect(() => {
    fetchTodayAssignments();
    fetchHistory();
  }, []);

  // latest attendance per assignment
  const latestByAssignment = useMemo(() => {
    const map = {};
    history.forEach(h => {
      const aid = h.assignmentId?._id || h.assignmentId;
      if (!aid) return;
      if (!map[aid]) map[aid] = h;
      else if (new Date(h.createdAt) > new Date(map[aid].createdAt)) map[aid] = h;
    });
    return map;
  }, [history]);

  const showMsg = (type, text) => setMessage({ type, text });

  const handleCheckIn = async (assignmentId) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/attendance/checkin', { assignmentId });
      showMsg('success', res.data?.message || 'Check-in thành công');
      await fetchHistory();
      await fetchTodayAssignments();
    } catch (err) {
      console.error('checkin', err);
      showMsg('error', err.response?.data?.message || err.message || 'Lỗi check-in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (assignmentId) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/attendance/checkout', { assignmentId });
      const workedMinutes = res.data?.workedMinutes;
      showMsg('success', `Check-out thành công${workedMinutes ? `. Làm việc: ${workedMinutes} phút.` : ''}`);
      await fetchHistory();
      await fetchTodayAssignments();
    } catch (err) {
      console.error('checkout', err);
      showMsg('error', err.response?.data?.message || err.message || 'Lỗi check-out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
        {/* header: back + title centered */}
        <header className="header center">
          <div className="header-top">
            <button
              className="back-btn"
              onClick={() => {
                // nếu dùng react-router, đổi sang navigate('/') khi cần
                if (window && window.history && window.history.length > 1) window.history.back();
                else window.location.href = '/';
              }}
              aria-label="Về trang chủ"
            >
              ← Về trang chủ
            </button>
          </div>

          <h1 className="title main-title">Quản lý chấm công</h1>
          <div className="sub">Ngày: {moment().format('DD/MM/YYYY')}</div>

          <div className="header-actions">
            <button
              className="history-toggle"
              onClick={() => {
                fetchHistory();
                setShowHistoryPanel(true);
              }}
            >
              📋 Lịch sử chấm công
            </button>
          </div>
        </header>

        {message && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {message.text}
          </div>
        )}

        <main>
          {/* hero */}
          <section className="today-hero">
            <div className="hero-left">
              <h3 className="hero-title">Ca làm việc hôm nay</h3>
              <p className="hero-sub">{moment().format('dddd, DD MMMM YYYY')}</p>
            </div>

            <div className="hero-right">
              <div className="stats">
                <div className="stat">
                  <div className="num">{assignments.length}</div>
                  <div className="label">Ca hôm nay</div>
                </div>
                <div className="stat">
                  <div className="num">{history.filter(h => moment(h.createdAt).isSame(moment(), 'day')).length}</div>
                  <div className="label">Bản ghi</div>
                </div>
              </div>
            </div>
          </section>

          {/* assignments */}
          <section className="section">
            {assignments.length === 0 ? (
              <div className="empty">Không có ca nào hôm nay.</div>
            ) : (
              <div className="card-list">
                {assignments.map(asg => {
                  const latest = latestByAssignment[asg._id];
                  const alreadyCheckedIn = !!(latest && latest.checkIn && !latest.checkOut);
                  const canCheckIn = !alreadyCheckedIn;
                  const canCheckOut = !!(latest && latest.checkIn && !latest.checkOut);

                  return (
                    <div className="card" key={asg._id}>
                      {/* main info */}
                      <div className="card-main">
                        <div className="shift-name">{asg.shiftId?.name || 'Ca làm việc'}</div>
                        <div className="shift-time">⏰ {asg.shiftId?.startTime || '-'} — {asg.shiftId?.endTime || '-'}</div>
                      </div>

                      {/* actions + status + times (wrapped correctly) */}
                      <div className="card-actions">
                        <button
                          className={`btn btn-in ${!canCheckIn ? 'disabled' : ''}`}
                          onClick={() => handleCheckIn(asg._id)}
                          disabled={!canCheckIn || loading}
                        >
                          Check In
                        </button>

                        <span className={`status-badge big status-${latest?.status || 'invalid'}`}>
                          {STATUS_LABEL[latest?.status] || 'Không xác định'}
                        </span>

                        <button
                          className={`btn btn-out ${!canCheckOut ? 'disabled' : ''}`}
                          onClick={() => handleCheckOut(asg._id)}
                          disabled={!canCheckOut || loading}
                        >
                          Check Out
                        </button>

                        <div className="card-times" aria-hidden>
                          <div className="time-line">Check-in: <strong>{fmtTime(latest?.checkIn)}</strong></div>
                          <div className="time-line">Check-out: <strong>{fmtTime(latest?.checkOut)}</strong></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* History slide-over panel */}
      <div className={`history-panel ${showHistoryPanel ? 'open' : ''}`} role="dialog" aria-hidden={!showHistoryPanel}>
        <div className="panel-inner" onClick={(e) => e.stopPropagation()}>
          <div className="panel-header">
            <h4>Lịch sử chấm công</h4>
            <button className="close" onClick={() => setShowHistoryPanel(false)}>Đóng</button>
          </div>

          <div className="panel-body">
            {history.length === 0 ? (
              <div className="no-data">Chưa có lịch sử chấm công</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Ca</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item._id}>
                      <td>{fmtDate(item.createdAt)}</td>
                      <td>{item.assignmentId?.shiftId?.name || 'N/A'}</td>
                      <td>{fmtTime(item.checkIn)}</td>
                      <td>{fmtTime(item.checkOut)}</td>
                      <td><span className={`status-badge status-${item.status || 'invalid'}`}>{STATUS_LABEL[item.status] || 'Không xác định'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* backdrop: click đóng panel */}
        <div className="panel-backdrop" onClick={() => setShowHistoryPanel(false)} />
      </div>

      {/* Styles (inline for quick dev) */}
      <style>{`
        :root{ --bg-1:#f7fbff; --bg-2:#f0f9ff; --muted:#6b7280; --card:#fff; --accent:#2563eb; --accent-2:#60a5fa; --danger:#ef4444 }
        .page-wrapper{ min-height:100vh; background: linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%); padding:40px 20px }
        .page-container{ max-width:1100px; margin:0 auto; background:transparent }

        /* header */
        .header{ display:flex; flex-direction:column; align-items:center; gap:8px; margin-bottom:18px }
        .header-top{ width:100%; display:flex; justify-content:flex-start }
        .title.main-title{ font-size:32px; margin:6px 0 0 0; font-weight:900; text-align:center }
        .sub{ color:var(--muted); font-size:13px }

        /* back button */
        .back-btn{ background:transparent; border:none; color:var(--accent); font-weight:800; font-size:14px; cursor:pointer; padding:6px 8px }
        .back-btn:hover{ text-decoration:underline }

        .header-actions{ margin-top:6px }

        .history-toggle{ background:#ffffff; border:1px solid rgba(15,23,42,0.12); padding:10px 16px; border-radius:12px; cursor:pointer; font-weight:700; font-size:14px; box-shadow:0 6px 18px rgba(0,0,0,0.04) }

        .alert{ padding:12px 14px; border-radius:10px; margin-top:6px; font-size:14px }
        .alert-success{ background:#eef2ff; color:#3730a3 }
        .alert-error{ background:#fff1f2; color:#991b1b }

        main{ margin-top:18px }

        /* hero */
        .today-hero{ display:flex; justify-content:space-between; align-items:center; gap:20px; background:linear-gradient(90deg, rgba(96,165,250,0.12), rgba(37,99,235,0.06)); padding:18px; border-radius:14px; border:1px solid rgba(37,99,235,0.09) }
        .hero-title{ font-size:20px; margin:0; font-weight:800 }
        .hero-sub{ margin:6px 0 0 0; color:var(--muted); font-size:13px }
        .stats{ display:flex; gap:12px }
        .stat{ text-align:center }
        .stat .num{ font-size:18px; font-weight:800 }
        .stat .label{ font-size:12px; color:var(--muted) }

        /* cards */
        .card-list{ display:grid; grid-template-columns:1fr; gap:18px; margin-top:16px }
        .card{ display:flex; flex-direction:column; gap:16px; padding:22px; background:var(--card); border-radius:16px; border:1px solid rgba(15,23,42,0.06); box-shadow:0 12px 40px rgba(2,6,23,0.06); align-items:stretch }
        .card-main{ min-width:0 }
        .shift-name{ font-size:20px; font-weight:800; color:#0f172a }
        .shift-time{ margin-top:10px; color:var(--muted); font-size:15px }

        .card-actions{ display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:16px; margin-top:6px }
        .btn{ padding:12px 22px; border-radius:14px; border:none; font-weight:800; cursor:pointer; font-size:16px }
        .btn:disabled{ opacity:0.6; cursor:not-allowed }
        .btn-in{ background:var(--accent); color:white }
        .btn-out{ background:#f3f4f6; color:#111827 }

        .status-badge{ display:inline-block; padding:8px 14px; border-radius:999px; font-weight:800; font-size:14px }
        .status-badge.big{ font-size:15px }
        .status-on_time{ background:#dcfce7; color:#166534 }
        .status-late{ background:#fee2e2; color:#991b1b }
        .status-early_leave{ background:#fff7ed; color:#9a3412 }
        .status-invalid{ background:#e5e7eb; color:#374151 }
        .status-checked_in{ background:#e0e7ff; color:#3730a3 }

        .card-times{ display:flex; flex-direction:column; gap:6px; text-align:right; min-width:160px }
        .time-line{ font-size:15px; color:#0f172a }

        /* panel history */
        .history-panel{ position:fixed; top:0; right:0; height:100vh; width:0; display:flex; align-items:stretch; pointer-events:none; z-index:60 }
        .history-panel.open{ width:100%; pointer-events:auto }
        .panel-inner{ margin-left:auto; width:460px; max-width:100%; background:#ffffff; height:100vh; box-shadow:-24px 0 48px rgba(0,0,0,0.18); transform:translateX(100%); transition:transform 240ms cubic-bezier(.2,.8,.2,1); display:flex; flex-direction:column }
        .history-panel.open .panel-inner{ transform:translateX(0) }
        .panel-header{ display:flex; align-items:center; justify-content:space-between; padding:16px; border-bottom:1px solid #eef2f6 }
        .panel-header h4{ margin:0; font-size:16px; font-weight:800 }
        .panel-header .close{ background:transparent; border:none; color:var(--muted); cursor:pointer; font-weight:700 }
        .panel-body{ padding:14px; overflow:auto; background:#fbfdff }

        .panel-backdrop{ flex:1; background:rgba(15,23,42,0.55) }

        .data-table{ width:100%; border-collapse:collapse; font-size:14px }
        .data-table thead th{ text-align:left; padding:12px 10px; font-size:13px; color:#334155 }
        .data-table tbody td{ padding:12px 10px; border-top:1px solid #eef2f6; color:#0f172a }
        .no-data{ text-align:center; padding:18px; color:var(--muted) }

        @media (max-width:720px){
          .card-list{ grid-template-columns:1fr }
          .panel-inner{ width:100% }
        }
      `}</style>
    </div>
  );
}
