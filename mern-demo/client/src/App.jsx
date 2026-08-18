import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  // CÂU 47: Lấy danh sách sinh viên từ Backend API (GET)
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // CÂU 49: Gửi Request POST đến API để thêm sinh viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ studentId: '', name: '', email: '' });
        fetchStudents(); // Cập nhật lại danh sách ngay lập tức
      }
    } catch (err) {
      console.error('Lỗi khi thêm sinh viên:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* CÂU 48: Form nhập MSSV, Họ tên và Email */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          placeholder="MSSV"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          required
        />
        <input
          placeholder="Họ tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">Thêm sinh viên</button>
      </form>

      {/* CÂU 47: Hiển thị danh sách sinh viên */}
      <h3>Danh Sách Sinh Viên</h3>
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            <strong>{s.studentId}</strong> - {s.name} ({s.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;