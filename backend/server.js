const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

// Middleware để đọc dữ liệu từ body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Đường dẫn lưu trữ dữ liệu
const dataFilePath = path.join(__dirname, 'data.json');
app.get('/', (req, res) => {
    res.send('<h1>Chào mừng bạn đến với API Lì Xì!</h1><p>Truy cập <a href="/leaderboard">bảng xếp hạng</a></p>');
});
// Route để lưu dữ liệu
app.post('/save-data', (req, res) => {
    console.log('Received request to save data:', req.body);
    const { name, amount, bankAccount, bankName } = req.body;

    let data = [];
    if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        data = JSON.parse(fileContent);
    }

    data.push({ name, amount, bankAccount, bankName });

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    console.log('Data saved successfully.');
    res.send('Dữ liệu đã được lưu thành công!');
});

// Route để lấy dữ liệu
app.get('/get-data', (req, res) => {
    if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        const data = JSON.parse(fileContent);
        res.json(data);
    } else {
        res.json([]);
    }
});
app.get('/leaderboard', (req, res) => {
    if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        const data = JSON.parse(fileContent);
        res.json(data);
    } else {
        res.json([]);
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});