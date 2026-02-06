import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- [PHẦN CẤU HÌNH CHO DỰ ÁN CỦA BẠN] ---
// Khi copy vào dự án, hãy BỎ COMMENT 2 dòng này và XÓA phần "PREVIEW CONFIG" bên dưới
// import axiosClient from '../api/axiosClient';
// import '../css/UserManager.css';

// --- [PREVIEW CONFIG - XÓA PHẦN NÀY KHI CHẠY Ở PROJECT THẬT] ---
// 1. Giả lập axiosClient kết nối tới http://localhost:3000/api thật
const axiosClient = {
  get: async (url) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api${url}`, {
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) 
      }
    });
    if (!res.ok) throw { response: { data: await res.json() } };
    return { data: await res.json() };
  },
  post: async (url, body) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api${url}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) 
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw { response: { data: await res.json() } };
    return { data: await res.json() };
  },
  put: async (url, body) => { // Thêm method PUT cho Mock Client
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api${url}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) 
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw { response: { data: await res.json() } };
    return { data: await res.json() };
  },
  delete: async (url) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api${url}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) 
      }
    });
    if (!res.ok) throw { response: { data: await res.json() } };
    return { data: await res.json() };
  }
};
// ----------------------------------------------------------------

const UserManager = () => {
  const [users, setUsers] = useState([]);
  
  // State form
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    bank: '',
    role: 'employee',
    hourlyRate: 25000
  });

  // State để quản lý chế độ sửa
  const [editingUser, setEditingUser] = useState(null); 
  const [loading, setLoading] = useState(false);

  // Load danh sách nhân viên khi vào trang
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/users'); 
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      username: '', 
      password: '', 
      fullname: '', 
      bank: '', 
      role: 'employee',
      hourlyRate: 25000
    });
    setEditingUser(null); // Thoát chế độ sửa
  };

  // Hàm xử lý khi click vào User để sửa
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Để trống vì không nhất thiết phải đổi pass
      fullname: user.fullname,
      bank: user.bank || '',
      role: user.role,
      hourlyRate: user.hourlyRate || 0
    });
    // Scroll lên đầu trang (nếu danh sách dài)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // --- LOGIC SỬA (UPDATE) ---
        // Nếu password rỗng, xóa khỏi payload để backend không hash chuỗi rỗng
        const payload = { ...formData };
        if (!payload.password) delete payload.password;

        await axiosClient.put(`/users/${editingUser._id}`, payload);
        alert('✅ Cập nhật thông tin thành công!');
      } else {
        // --- LOGIC TẠO MỚI (CREATE) ---
        await axiosClient.post('/auth/register', formData);
        alert('✅ Tạo tài khoản thành công!');
      }
      
      resetForm();
      loadUsers(); // Reload danh sách
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      alert('❌ Lỗi: ' + msg);
    }
  };

  const handleDelete = async (userId, e) => {
    // Ngăn chặn sự kiện click lan truyền (để không kích hoạt handleEditClick khi bấm nút xóa)
    e.stopPropagation(); 
    
    if (window.confirm('⚠️ Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await axiosClient.delete(`/users/${userId}`);
        alert('🗑️ Đã xóa nhân viên!');
        
        // Nếu đang sửa user này mà lại xóa nó -> reset form
        if (editingUser && editingUser._id === userId) {
          resetForm();
        }

        setUsers(prev => prev.filter(u => u._id !== userId));
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        alert('❌ Lỗi khi xóa: ' + msg);
      }
    }
  };

  return (
    <div className="page-container">
      {/* STYLE NHÚNG (Xóa khi dùng thật) */}
      <style>{`
        .page-container {
          --primary: #4f46e5; --primary-bg: #e0e7ff; --purple-accent: #8b5cf6;
          --bg-page: #f8fafc; --bg-panel: #ffffff; --text-main: #0f172a;
          --text-sub: #64748b; --border: #e2e8f0; --radius: 16px;
          --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

          font-family: 'Inter', sans-serif;
          background-color: var(--bg-page);
          min-height: 100vh;
          display: flex; flex-direction: column;
        }
        .page-header {
          background: #fff; padding: 1.25rem 2rem; max-width: 1200px;
          width: calc(100% - 2rem); margin: 1.5rem auto; border-radius: var(--radius);
          border: 1px solid var(--border); border-top: 4px solid var(--purple-accent);
          display: flex; justify-content: space-between; align-items: center;
        }
        .back-link { text-decoration: none; color: var(--text-sub); font-size: 0.85rem; font-weight: 600; }
        .page-title { margin: 0; font-size: 1.75rem; color: var(--text-main); font-weight: 800; }
        .badge-admin { background: #f3e8ff; color: #7e22ce; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; border: 1px solid #d8b4fe; }
        .page-content { max-width: 1000px; margin: 0 auto; width: calc(100% - 2rem); padding-bottom: 3rem; }
        
        /* FORM */
        .section-panel { background: var(--bg-panel); border-radius: var(--radius); border: 1px solid rgba(226,232,240,0.6); margin-bottom: 2.5rem; overflow: hidden; transition: border-color 0.3s; }
        .section-panel.editing { border: 2px solid var(--purple-accent); } /* Hiệu ứng viền khi đang sửa */
        
        .section-title { background: linear-gradient(to right, #f8fafc, #ffffff); padding: 1rem 1.5rem; font-weight: 700; border-bottom: 1px solid var(--border); text-transform: uppercase; display: flex; justify-content: space-between; align-items: center; }
        .edit-badge { background: var(--purple-accent); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; margin-left: 10px; }
        
        .panel-body { padding: 2rem; }
        .user-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-grid-user { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-control { padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 8px; width: 100%; box-sizing: border-box; }
        .helper-text { font-size: 0.75rem; color: var(--text-sub); font-style: italic; margin-top: -4px; }
        
        /* ACTION BUTTONS */
        .form-actions { display: flex; gap: 10px; }
        .btn-submit { padding: 0.75rem; background: var(--purple-accent); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; flex: 1; transition: background 0.2s; }
        .btn-submit:hover { background: #7c3aed; }
        .btn-submit.btn-update { background: #059669; } /* Màu xanh lá cho nút Update */
        .btn-submit.btn-update:hover { background: #047857; }
        
        .btn-cancel { padding: 0.75rem; background: #e2e8f0; color: var(--text-main); border: none; border-radius: 8px; font-weight: 700; cursor: pointer; width: 100px; }
        .btn-cancel:hover { background: #cbd5e1; }
        
        /* LIST */
        .list-title { font-size: 1.25rem; font-weight: 800; border-left: 4px solid var(--purple-accent); padding-left: 0.5rem; margin-bottom: 1.5rem; }
        .users-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        
        .user-card-admin { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; cursor: pointer; transition: transform 0.2s, border-color 0.2s; position: relative; }
        .user-card-admin:hover { transform: translateY(-4px); border-color: var(--purple-accent); box-shadow: var(--shadow-card); }
        .user-card-admin.active { border: 2px solid var(--purple-accent); background-color: #f3e8ff; } /* Highlight card đang sửa */
        
        .card-header-admin { display: flex; justify-content: space-between; align-items: flex-start; }
        .user-info-header h4 { margin: 0; font-size: 1.1rem; font-weight: 700; }
        .username-sub { font-size: 0.85rem; color: var(--text-sub); }
        .role-badge { font-size: 0.75rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; text-transform: capitalize; }
        .role-employee { background: #eff6ff; color: #1e40af; } .role-manager { background: #f0fdf4; color: #166534; } .role-admin { background: #fef2f2; color: #991b1b; }
        .card-body-admin { background: #faf5ff; padding: 0.75rem; border-radius: 8px; }
        .user-card-admin.active .card-body-admin { background: #ffffff; }
        .info-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px; }
        
        .btn-delete { background: #fff; color: #dc3545; border: 1px solid #dc3545; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-left: auto; display: block; z-index: 2; }
        .btn-delete:hover { background: #dc3545; color: white; }
        
        .click-hint { font-size: 0.75rem; text-align: center; color: var(--text-sub); margin-top: auto; padding-top: 10px; border-top: 1px solid #eee; font-style: italic; }
        
        @media (max-width: 768px) { .form-grid-user { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <span className="arrow">←</span> Trở về Dashboard
          </Link>
          <h2 className="page-title">Quản lý Nhân Sự</h2>
        </div>
        <div className="header-right">
             <span className="badge-admin">Admin Zone</span>
        </div>
      </header>

      <div className="page-content">
        
        {/* Form Panel: Class 'editing' thêm viền tím khi đang sửa */}
        <div className={`section-panel form-panel ${editingUser ? 'editing' : ''}`}>
            <div className="section-title">
                <span>
                  {editingUser ? '✏️ Chỉnh sửa thông tin' : '➕ Thêm nhân viên mới'}
                  {editingUser && <span className="edit-badge">Đang sửa: {editingUser.fullname}</span>}
                </span>
            </div>
            <div className="panel-body">
                <form onSubmit={handleSubmit} className="user-form">
                    <div className="form-grid-user">
                        <div className="form-group">
                            <label>Tài khoản (Username)</label>
                            <input 
                              className="form-control" 
                              placeholder="VD: nguyenvan_a" 
                              value={formData.username} 
                              onChange={e => setFormData({...formData, username: e.target.value})} 
                              required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input 
                              type="password" 
                              className="form-control" 
                              placeholder={editingUser ? "Để trống nếu không đổi" : "******"} 
                              value={formData.password} 
                              onChange={e => setFormData({...formData, password: e.target.value})} 
                              required={!editingUser} // Chỉ bắt buộc khi tạo mới
                            />
                            {editingUser && <span className="helper-text">* Nhập để đổi mật khẩu mới</span>}
                        </div>
                        <div className="form-group">
                            <label>Họ và Tên</label>
                            <input 
                              className="form-control" 
                              placeholder="VD: Nguyễn Văn A" 
                              value={formData.fullname} 
                              onChange={e => setFormData({...formData, fullname: e.target.value})} 
                              required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Chức vụ</label>
                            <select 
                              className="form-control" 
                              value={formData.role} 
                              onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="employee">Employee (Nhân viên)</option>
                                <option value="manager">Manager (Quản lý)</option>
                                <option value="admin">Admin (Quản trị)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Thông tin Ngân hàng</label>
                            <input 
                              className="form-control" 
                              placeholder="Tên NH - Số TK - Chi nhánh" 
                              value={formData.bank} 
                              onChange={e => setFormData({...formData, bank: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Lương/Giờ (VNĐ)</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              value={formData.hourlyRate} 
                              onChange={e => setFormData({...formData, hourlyRate: e.target.value})} 
                            />
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="form-actions">
                        {editingUser && (
                          <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                            Hủy
                          </button>
                        )}
                        <button 
                          type="submit" 
                          className={`btn-submit ${editingUser ? 'btn-update' : ''}`}
                        >
                            {editingUser ? '💾 Xác nhận thay đổi' : '✨ Tạo Tài Khoản'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Danh sách Users */}
        <div className="list-section">
            <h3 className="list-title">Danh sách nhân viên ({users.length})</h3>
            
            {loading ? (
                <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>Đang tải dữ liệu...</div>
            ) : (
                <div className="users-grid">
                    {users.length === 0 && <p style={{gridColumn: '1/-1', textAlign: 'center'}}>Chưa có nhân viên nào.</p>}
                    {users.map(user => (
                        // Thêm sự kiện onClick để chọn user cần sửa
                        <div 
                          key={user._id} 
                          className={`user-card-admin ${editingUser?._id === user._id ? 'active' : ''}`}
                          onClick={() => handleEditClick(user)}
                          title="Click để chỉnh sửa"
                        >
                            <div className="card-header-admin">
                                <div className="user-info-header">
                                    <h4>{user.fullname}</h4>
                                    <span className="username-sub">@{user.username}</span>
                                </div>
                                <span className={`role-badge role-${user.role}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="card-body-admin">
                                <div className="info-row">
                                    <span className="label">Bank:</span>
                                    <span className="value">{user.bank || '---'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Lương/h:</span>
                                    <span className="value">{user.hourlyRate ? user.hourlyRate.toLocaleString() : 0} đ</span>
                                </div>
                            </div>
                            
                            <div className="click-hint">Click để sửa thông tin</div>

                            <div className="card-footer-admin">
                                <button 
                                  className="btn-delete" 
                                  onClick={(e) => handleDelete(user._id, e)} // Truyền event e
                                >
                                  🗑 Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserManager;