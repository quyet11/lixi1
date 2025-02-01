document.addEventListener('DOMContentLoaded', function() {
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

            function showLeaderboard() {
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
                leaderboard.style.display = 'block';
                localStorage.setItem('leaderboardVisible', 'true'); // Lưu trạng thái
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    leaderboardBtn.addEventListener('click', showLeaderboard);

    document.getElementById('close-leaderboard').addEventListener('click', function() {
        leaderboard.style.display = 'none';
        localStorage.removeItem('leaderboardVisible'); // Xóa trạng thái
    });

    function createEnvelopes(userName) {
        const envelopes = document.getElementById('envelopes');
        envelopes.innerHTML = ''; // Xóa phong bao cũ trước khi tạo mới
        for (let i = 0; i < 300; i++) {
            const envelope = document.createElement('div');
            envelope.classList.add('envelope');
            envelope.style.left = `${Math.random() * 100}vw`;
            envelope.style.top = `${Math.random() * 100}vh`;

            const amount = Math.random() < 0.8 ? 
                Math.floor(Math.random() * 10000) + 1000 : 
                Math.floor(Math.random() * 20000) + 10000;

            envelope.style.animationDuration = `${Math.random() * 5 + 1}s`;
            envelope.addEventListener('click', function() {
                if (!localStorage.getItem('luckyMoney')) {
                    localStorage.setItem('luckyMoney', amount.toLocaleString());
                    localStorage.setItem('userName', userName);
                    message.innerHTML = `Chúc mừng ${userName}, bạn đã được lì xì <strong>${amount.toLocaleString()} VND</strong>!<br>Vui lòng nhập số tài khoản và ngân hàng bạn dùng.`;
                    popup.classList.remove('hidden');
                }
            });

            envelope.style.transition = "all 0.3s ease-out";
            envelopes.appendChild(envelope);
        }
    }

    startBtn.addEventListener('click', function() {
        const userName = userNameInput.value.trim();
        if (userName) {
            localStorage.setItem('userName', userName);
            welcomeScreen.classList.add('hidden');
            envelopesContainer.classList.remove('hidden');
            leaderboardBtn.style.display = 'block';
            createEnvelopes(userName);
        } else {
            alert('Vui lòng nhập tên của bạn!');
        }
    });

    submitBtn.addEventListener('click', function() {
        const account = bankAccount.value.trim();
        const bank = bankName.value.trim();
        const userName = localStorage.getItem('userName');
        const amount = localStorage.getItem('luckyMoney');

        if (account && bank && userName && amount) {
            if (localStorage.getItem('submitted') === 'true') {
                alert('Thông tin đã được gửi rồi!');
                return;
            }

            fetch('https://lixi1.onrender.com/save-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                localStorage.setItem('submitted', 'true');
                popup.classList.add('hidden');
                localStorage.removeItem('luckyMoney');
                localStorage.removeItem('userName');
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

    // Phục hồi trạng thái khi reload
    const savedLuckyMoney = localStorage.getItem('luckyMoney');
    const savedUserName = localStorage.getItem('userName');
    const submitted = localStorage.getItem('submitted');
    const leaderboardVisible = localStorage.getItem('leaderboardVisible');

    if (savedUserName) {
        welcomeScreen.classList.add('hidden');
        envelopesContainer.classList.remove('hidden');
        leaderboardBtn.style.display = 'block';
        createEnvelopes(savedUserName);
    }

    if (savedLuckyMoney && !submitted) {
        message.innerHTML = `Chúc mừng ${savedUserName}, bạn đã được lì xì <strong>${savedLuckyMoney} VND</strong>!<br>Vui lòng nhập số tài khoản và ngân hàng bạn dùng.`;
        popup.classList.remove('hidden');
    }

    if (leaderboardVisible) {
        showLeaderboard();
    }
});
