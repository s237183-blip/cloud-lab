import { useState, useEffect } from 'react';

// Gọi trực tiếp đến Backend API chạy ở cổng 5000
const API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (res.ok) setStudents(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ studentId: '', name: '', email: '' });
        setEditingId(null);
        fetchStudents();
      } else {
        alert('Lỗi từ Server: ' + (data.error || 'Thao tác thất bại'));
      }
    } catch (err) {
      alert('Lỗi kết nối API: ' + err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({ studentId: student.studentId, name: student.name, email: student.email });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStudents();
      } else {
        const data = await res.json();
        alert('Không thể xóa: ' + data.error);
      }
    } catch (err) {
      alert('Lỗi khi xóa: ' + err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header Dashboard */}
        <header style={styles.header}>
          <div style={styles.badge}>DASHBOARD CONTROL</div>
          <h1 style={styles.title}>Hệ Thống Quản Lý Sinh Viên v2.0</h1>
          <p style={styles.subtitle}>Quản lý dữ liệu sinh viên chuẩn hóa & đồng bộ thời gian thực</p>
        </header>

        {/* Form nhập thông tin */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            {editingId ? '✏️ Cập Nhật Thông Tin Sinh Viên' : '➕ Thêm Sinh Viên Mới'}
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGrid}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Mã sinh viên (MSSV)</label>
                <input
                  style={styles.input}
                  placeholder="Ví dụ: SV001"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Họ và tên</label>
                <input
                  style={styles.input}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Địa chỉ Email</label>
                <input
                  style={styles.input}
                  placeholder="name@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={styles.btnRow}>
              <button type="submit" style={editingId ? styles.btnUpdate : styles.btnAdd}>
                {editingId ? '💾 Lưu Thay Đổi' : '🚀 Thêm Sinh Viên'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm({ studentId: '', name: '', email: '' }); }}
                  style={styles.btnCancel}
                >
                  ✖ Hủy bỏ
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bảng Danh Sách */}
        <div style={styles.card}>
          <div style={styles.tableHeaderRow}>
            <h2 style={styles.cardTitle}>📋 Danh Sách Sinh Viên</h2>
            <span style={styles.countTag}>{students.length} sinh viên</span>
          </div>

          {students.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyText}>Chưa có dữ liệu sinh viên trong hệ thống.</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>MSSV</th>
                    <th style={styles.th}>Họ tên</th>
                    <th style={styles.th}>Email</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={s._id} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.tdMSSV}>{s.studentId}</td>
                      <td style={styles.tdName}>{s.name}</td>
                      <td style={styles.tdEmail}>{s.email}</td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <button onClick={() => handleEdit(s)} style={styles.btnEdit}>
                          ✏️ Sửa
                        </button>
                        <button onClick={() => handleDelete(s._id)} style={styles.btnDelete}>
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Custom Stylesheet (Modern Dark UI)
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0b0f19 0%, #111827 100%)',
    color: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  },
  container: {
    width: '100%',
    maxWidth: '960px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '8px'
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '12px',
    border: '1px solid rgba(99, 102, 241, 0.3)'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(to right, #6366f1, #38bdf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '15px',
    margin: 0
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    border: '1px solid #374151'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f9fafb',
    margin: '0 0 20px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#9ca3af'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #4b5563',
    backgroundColor: '#111827',
    color: '#f3f4f6',
    fontSize: '14px',
    outline: 'none'
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  btnAdd: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  btnUpdate: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  btnCancel: {
    padding: '12px 20px',
    backgroundColor: '#374151',
    color: '#d1d5db',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  tableHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  countTag: {
    backgroundColor: '#374151',
    color: '#38bdf8',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #374151'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    backgroundColor: '#111827',
    color: '#9ca3af',
    padding: '14px 18px',
    fontWeight: '600',
    textAlign: 'left',
    borderBottom: '1px solid #374151'
  },
  td: {
    padding: '14px 18px',
    borderBottom: '1px solid #374151'
  },
  tdMSSV: {
    padding: '14px 18px',
    borderBottom: '1px solid #374151',
    fontWeight: '700',
    color: '#38bdf8'
  },
  tdName: {
    padding: '14px 18px',
    borderBottom: '1px solid #374151',
    fontWeight: '600',
    color: '#f9fafb'
  },
  tdEmail: {
    padding: '14px 18px',
    borderBottom: '1px solid #374151',
    color: '#9ca3af'
  },
  trEven: {
    backgroundColor: '#1f2937'
  },
  trOdd: {
    backgroundColor: '#182232'
  },
  btnEdit: {
    padding: '6px 14px',
    marginRight: '8px',
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    color: '#facc15',
    border: '1px solid rgba(234, 179, 8, 0.3)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnDelete: {
    padding: '6px 14px',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  emptyBox: {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#111827',
    borderRadius: '12px',
    border: '1px dashed #374151'
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0
  }
};

export default App;