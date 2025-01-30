document.addEventListener('DOMContentLoaded', function () {
    const welcomeScreen = document.getElementById('welcome-screen');
    const envelopesContainer = document.getElementById('envelopes-container');
    const popup = document.getElementById('popup');
    const message = document.getElementById('message');
    const bankAccount = document.getElementById('bank-account');
    const bankName = document.getElementById('bank-name');
    const submitBtn = document.getElementById('submit-btn');
    const userNameInput = document.getElementById('user-name');
    const startBtn = document.getElementById('start-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const leaderboard = document.getElementById('leaderboard');
    const leaderboardTable = document.getElementById('leaderboard-table');
    startBtn.addEventListener('click', function () {
        const userName = userNameInput.value.trim();
        if (userName) {
            welcomeScreen.classList.add('hidden');
            envelopesContainer.classList.remove('hidden');
            leaderboardBtn.style.display = 'block';  // Hiện nút "Bảng Vàng"
            createEnvelopes(userName);
        } else {
            alert('Vui lòng nhập tên của bạn!');
        }
    });
    // Hiển thị bảng vàng khi nhấn nút "Bảng Vàng"
    leaderboardBtn.addEventListener('click', function () {
        fetch('https://lixi1.onrender.com/leaderboard')
            .then(response => response.json())
            .then(data => {
                leaderboardTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Số Tiền</th>
                        <th>Số Tài Khoản</th>
                        <th>Ngân Hàng</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.amount} VND</td>
                            <td>${user.bankAccount}</td>
                            <td>${user.bankName}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
                leaderboard.style.display = 'block'; // Hiện bảng vàng
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    });
    // Khi nhấn nút "X", ẩn bảng vàng
    document.getElementById('close-leaderboard').addEventListener('click', function () {
        leaderboard.style.display = 'none';
    });

    // Kiểm tra xem người dùng đã chọn lì xì chưa
    const savedLuckyMoney = localStorage.getItem('luckyMoney');
    if (savedLuckyMoney) {
        welcomeScreen.classList.add('hidden');
        envelopesContainer.classList.add('hidden');
        message.textContent = `Chúc mừng bạn đã được lì xì ${savedLuckyMoney} VND!`;
        popup.classList.remove('hidden');
    }

    // Bắt đầu khi người dùng nhấn nút "Xác nhận"
    startBtn.addEventListener('click', function () {
        const userName = userNameInput.value.trim();
        if (userName) {
            welcomeScreen.classList.add('hidden');
            envelopesContainer.classList.remove('hidden');
            createEnvelopes(userName);  // Truyền userName vào hàm createEnvelopes
        } else {
            alert('Vui lòng nhập tên của bạn!');
        }
    });

    // Tạo 100 cái lì xì bay tứ tung
    function createEnvelopes(userName) {
        const envelopes = document.getElementById('envelopes');
        for (let i = 0; i < 300; i++) {
            const envelope = document.createElement('div');
            envelope.classList.add('envelope');
            envelope.style.left = `${Math.random() * 100}vw`;
            envelope.style.top = `${Math.random() * 100}vh`;

            // Logic xác suất: Số tiền dưới 10,000 xuất hiện nhiều hơn
            const amount = Math.random() < 0.8  // 80% xác suất cho số tiền dưới 10,000
                ? Math.floor(Math.random() * 10000) + 1000  // Từ 1,000 đến 10,000
                : Math.floor(Math.random() * 20000) + 10000;  // Từ 10,000 đến 30,000

            envelope.style.animationDuration = `${Math.random() * 5 + 1}s`; // Tốc độ di chuyển ngẫu nhiên
            envelope.addEventListener('click', function () {
                if (!localStorage.getItem('luckyMoney')) {
                    localStorage.setItem('luckyMoney', amount.toLocaleString()); // Lưu số tiền vào localStorage
                     message.innerHTML = `Chúc mừng ${userName}, bạn đã được lì xì <strong>${amount.toLocaleString()} VND</strong>!<br>Vui lòng nhập số tài khoản và ngân hàng bạn dùng.<br>Đừng reload, reload là mất đấy nhé!`;
                    popup.classList.remove('hidden');
                }
            });

            // Thêm hiệu ứng chuyển động chậm hơn
            envelope.style.transition = "all 0.3s ease-out";  // Chuyển động mượt mà hơn
            envelopes.appendChild(envelope);
        }
    }


    // Xử lý khi người dùng nhấn nút "Gửi"
    submitBtn.addEventListener('click', function () {
        const account = bankAccount.value.trim();
        const bank = bankName.value.trim();
        const userName = userNameInput.value.trim();
        const amount = localStorage.getItem('luckyMoney');

        if (account && bank && userName && amount) {
            // Kiểm tra xem đã gửi dữ liệu chưa
            if (localStorage.getItem('submitted') === 'true') {
                alert('Thông tin đã được gửi rồi!');
                return;
            }

            // Gửi dữ liệu lên server
            fetch('https://lixi1.onrender.com/save-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userName,
                    amount: amount,
                    bankAccount: account,
                    bankName: bank,
                }),
            })
                .then(response => response.text())
                .then(data => {
                    alert('Thông tin đã được gửi thành công!');
                    localStorage.setItem('submitted', 'true'); // Đánh dấu đã gửi dữ liệu
                    popup.classList.add('hidden');
                    bankAccount.value = '';
                    bankName.value = '';
                })
                .catch(error => {
                    console.error('Lỗi gửi dữ liệu:', error);
                });
        } else {
            alert('Vui lòng nhập đầy đủ thông tin!');
        }
    });
});
