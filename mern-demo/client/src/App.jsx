import { useState, useEffect } from 'react';

// URL API qua Vite Proxy (giữ nguyên để chạy không bị lỗi CORS)
const API_URL = '/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // CÂU 47: Lấy danh sách sinh viên từ Backend API (GET)
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (res.ok) {
        setStudents(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // CÂU 49 & 61: Gửi Request POST (Thêm mới) hoặc PUT (Cập nhật)
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

  // CÂU 61: Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({ studentId: student.studentId, name: student.name, email: student.email });
  };

  // CÂU 62: Xóa sinh viên (DELETE)
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
      <div style={styles.card}>
        <h2 style={styles.title}>Quản Lý Sinh Viên</h2>

        {/* Form nhập thông tin */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Mã sinh viên (MSSV)"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Họ tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.btnGroup}>
            <button type="submit" style={editingId ? styles.btnUpdate : styles.btnAdd}>
              {editingId ? '💾 Cập Nhật' : '➕ Thêm Sinh Viên'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm({ studentId: '', name: '', email: '' }); }}
                style={styles.btnCancel}
              >
                ✖ Hủy
              </button>
            )}
          </div>
        </form>

        {/* Danh sách sinh viên trình bày dạng bảng */}
        <h3 style={styles.subtitle}>
          Danh Sách Sinh Viên ({students.length})
        </h3>

        {students.length === 0 ? (
          <p style={styles.emptyText}>Chưa có sinh viên nào trong danh sách.</p>
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
                    <td style={styles.td}><strong>{s.studentId}</strong></td>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.email}</td>
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
  );
}

// Styles dạng JS Object cho giao diện Dashboard hiện đại
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '850px',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
    border: '1px solid #334155',
    alignSelf: 'flex-start'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '24px',
    color: '#38bdf8'
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginTop: '32px',
    marginBottom: '16px',
    color: '#94a3b8',
    borderBottom: '1px solid #334155',
    paddingBottom: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#0f172a',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #334155'
  },
  inputGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #475569',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    fontSize: '14px',
    outline: 'none'
  },
  btnGroup: {
    display: 'flex',
    gap: '10px'
  },
  btnAdd: {
    padding: '12px 20px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnUpdate: {
    padding: '12px 20px',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnCancel: {
    padding: '12px 20px',
    backgroundColor: '#64748b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
    border: '1px solid #334155'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px'
  },
  th: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    padding: '14px 16px',
    fontWeight: '600',
    borderBottom: '1px solid #334155'
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #334155'
  },
  trEven: {
    backgroundColor: '#1e293b'
  },
  trOdd: {
    backgroundColor: '#182232'
  },
  btnEdit: {
    padding: '6px 12px',
    marginRight: '8px',
    backgroundColor: '#eab308',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnDelete: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    padding: '20px'
  }
};

export default App;