const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// ==========================================
// CÂU 21: Xây dựng Express Server chạy trên port 5000
// ==========================================
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// CÂU 22: Tạo API GET /api/hello
// ==========================================
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend Node.js đang hoạt động thành công!' });
});

// ==========================================
// CÂU 33: Kết nối Express Backend với MongoDB Atlas
// ==========================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối thành công tới MongoDB Atlas!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB Atlas:', err));

// ==========================================
// CÂU 35: Import Student Model
// (Đảm bảo đã tạo file mern-demo/server/models/Student.js)
// ==========================================
const Student = require('./models/Student');

// ==========================================
// CÂU 36: Xây dựng API GET /api/students (Lấy danh sách sinh viên)
// ==========================================
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CÂU 37: Xây dựng API POST /api/students (Thêm sinh viên)
// ==========================================
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// CÂU 38: Xây dựng API PUT /api/students/:id (Cập nhật sinh viên)
// ==========================================
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// CÂU 39: Xây dựng API DELETE /api/students/:id (Xóa sinh viên)
// ==========================================
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa sinh viên thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});