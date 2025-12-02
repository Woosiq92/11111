document.addEventListener('DOMContentLoaded', function() {

    const targetDateDiv = document.getElementById('targetDate');
    const countdownDiv = document.getElementById('countdown');
    const timeCountdownDiv = document.getElementById('timeCountdown');
    const daysInfoDiv = document.getElementById('daysInfo');
    const celebrationDiv = document.getElementById('celebration');
    const resultCard = document.querySelector('.result-card');

    // 🎧 배경 음악
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.5;

    function tryAutoPlay() {
        backgroundMusic.currentTime = 10;
        backgroundMusic.play().catch(() => {});
    }

    tryAutoPlay();
    document.addEventListener('click', tryAutoPlay, { once: true });

    // 🎂 생년월일 (로컬 시간 기준)
    const birthDate = new Date(1995, 6, 4); // 1995-07-04

    // 🎯 11,111일 후 날짜 계산 (태어난 날 = 1일)
    const targetDate = new Date(birthDate);
    targetDate.setDate(targetDate.getDate() + 11110);
    targetDate.setHours(0, 0, 0, 0); // 자정 고정

    // 목표 날짜 표시
    targetDateDiv.textContent = formatDate(targetDate);

    let timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        // ✅ 디데이 도달 → 축하 화면
        if (diff <= 0) {
            clearInterval(timer);
            resultCard.style.display = "none";
            celebrationDiv.style.display = "block";
            return;
        }

        // ⏱ 남은 시간 계산
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        // D-day 표시
        countdownDiv.innerHTML = `<div class="d-day-number">D-${days.toLocaleString()}</div>`;

        // 실시간 시간 표시
        timeCountdownDiv.innerHTML = `
            <div class="time-display">
                <div class="time-unit">
                    <div class="time-value">${String(hours).padStart(2, '0')}</div>
                    <div class="time-label">시간</div>
                </div>
                <div class="time-separator">:</div>
                <div class="time-unit">
                    <div class="time-value">${String(minutes).padStart(2, '0')}</div>
                    <div class="time-label">분</div>
                </div>
                <div class="time-separator">:</div>
                <div class="time-unit">
                    <div class="time-value">${String(seconds).padStart(2, '0')}</div>
                    <div class="time-label">초</div>
                </div>
            </div>
        `;

        daysInfoDiv.textContent = `계연주님의 11,111일까지 ${days.toLocaleString()}일 ${hours}시간 ${minutes}분 ${seconds}초 남았습니다!`;
    }

    // 📅 날짜 포맷 함수
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[date.getDay()];
        return `${year}년 ${month}월 ${day}일 (${weekday})`;
    }

    // ===============================
    // 📖 방명록 기능 (원본 유지)
    // ===============================

    const guestNameInput = document.getElementById('guestName');
    const guestMessageInput = document.getElementById('guestMessage');
    const submitGuestbookBtn = document.getElementById('submitGuestbook');
    const guestbookList = document.getElementById('guestbookList');

    function loadGuestbook() {
        const guestbook = JSON.parse(localStorage.getItem('guestbook') || '[]');
        guestbookList.innerHTML = '';

        if (guestbook.length === 0) {
            guestbookList.innerHTML = '<p class="no-message">아직 방명록이 없습니다. 첫 번째 메시지를 남겨주세요! 💕</p>';
            return;
        }

        guestbook.sort((a, b) => new Date(b.date) - new Date(a.date));

        guestbook.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'guestbook-entry';
            entryDiv.innerHTML = `
                <div class="entry-header">
                    <div class="entry-info">
                        <span class="entry-name">${escapeHtml(entry.name)}</span>
                        <span class="entry-date">${formatGuestbookDate(entry.date)}</span>
                    </div>
                    <button class="delete-btn" data-id="${entry.id}">🗑️</button>
                </div>
                <div class="entry-message">${escapeHtml(entry.message)}</div>
            `;
            guestbookList.appendChild(entryDiv);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteGuestbookEntry(this.dataset.id);
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatGuestbookDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2,'0')}`;
    }

    function saveGuestbook(name, message) {
        const guestbook = JSON.parse(localStorage.getItem('guestbook') || '[]');
        guestbook.push({
            id: Date.now().toString(),
            name,
            message,
            date: new Date().toISOString()
        });
        localStorage.setItem('guestbook', JSON.stringify(guestbook));
        loadGuestbook();
    }

    function deleteGuestbookEntry(entryId) {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        let guestbook = JSON.parse(localStorage.getItem('guestbook') || '[]');
        guestbook = guestbook.filter(entry => entry.id !== entryId);
        localStorage.setItem('guestbook', JSON.stringify(guestbook));
        loadGuestbook();
    }

    submitGuestbookBtn.addEventListener('click', function() {
        const name = guestNameInput.value.trim();
        const message = guestMessageInput.value.trim();

        if (!name || !message) {
            alert('이름과 메시지를 입력하세요!');
            return;
        }

        saveGuestbook(name, message);
        guestNameInput.value = '';
        guestMessageInput.value = '';
        alert('방명록이 등록되었습니다! 💕');
    });

    guestMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitGuestbookBtn.click();
        }
    });

    loadGuestbook();

});