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

        // Trả về dữ liệu JSON dưới dạng HTML để hiển thị và chỉnh sửa
        let html = '<h1>Bảng xếp hạng</h1>';
        html += '<table><tr><th>Tên</th><th>Số tiền</th><th>Tài khoản ngân hàng</th><th>Ngân hàng</th><th>Hành động</th></tr>';

        data.forEach((item) => {
            html += `<tr>
                <td>${item.name}</td>
                <td>${item.amount}</td>
                <td>${item.bankAccount}</td>
                <td>${item.bankName}</td>
                <td>
                    <form action="/update-data/${item.name}" method="POST">
                        <input type="number" name="amount" value="${item.amount}" />
                        <input type="text" name="bankAccount" value="${item.bankAccount}" />
                        <input type="text" name="bankName" value="${item.bankName}" />
                        <button type="submit">Cập nhật</button>
                    </form>
                </td>
            </tr>`;
        });
        html += '</table>';
        res.send(html);
    } else {
        res.json([]);
    }
});

// Route để cập nhật dữ liệu từ form
app.post('/update-data/:name', (req, res) => {
    const { name } = req.params; // Lấy 'name' từ URL
    const { amount, bankAccount, bankName } = req.body; // Lấy các dữ liệu từ form gửi lên

    // Kiểm tra nếu file JSON tồn tại
    if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        let data = JSON.parse(fileContent);

        // Tìm kiếm phần tử cần cập nhật
        const index = data.findIndex(item => item.name === name);

        if (index !== -1) {
            // Cập nhật dữ liệu
            data[index] = {...data[index], amount, bankAccount, bankName };

            // Lưu lại file JSON
            fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
            res.redirect('/leaderboard'); // Sau khi cập nhật, chuyển hướng lại trang leaderboard
        } else {
            res.status(404).send('Không tìm thấy dữ liệu để cập nhật.');
        }
    } else {
        res.status(404).send('File dữ liệu không tồn tại.');
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
