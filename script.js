document.addEventListener('DOMContentLoaded', function() {
    const resultDiv = document.getElementById('result');
    const targetDateDiv = document.getElementById('targetDate');
    const countdownDiv = document.getElementById('countdown');
    const timeCountdownDiv = document.getElementById('timeCountdown');
    const daysInfoDiv = document.getElementById('daysInfo');
    const celebrationDiv = document.getElementById('celebration');
    const resultCard = document.querySelector('.result-card');
    
    // 배경음악 자동 재생
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    // 음량 설정 (0.0 ~ 1.0)
    backgroundMusic.volume = 0.5; // 50% 볼륨
    
    // 자동 재생 시도
    function tryAutoPlay() {
        // 재생 전에 10초부터 시작
        backgroundMusic.currentTime = 10;
        backgroundMusic.play().catch(function(error) {
            console.log('자동 재생 실패 (브라우저 정책):', error);
        });
    }
    
    // 페이지 로드 시 자동 재생 시도
    tryAutoPlay();
    
    // 사용자가 페이지 어디든 클릭하면 재생 시도
    document.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            tryAutoPlay();
        }
    }, { once: true }); // 한 번만 실행

    // 계연주님의 생년월일: 1995년 7월 4일 (자정 기준)
    // 태어난 날을 1일로 계산하면, 11,111일이 되는 날은 생년월일부터 11,110일 후
    const birthDate = new Date('1995-07-04T00:00:00');
    const targetDate = new Date(birthDate);
    targetDate.setDate(targetDate.getDate() + 11110); // 태어난 날이 1일이므로 11,110일 더하기
    // 11,111일이 되는 날의 자정
    targetDate.setHours(0, 0, 0, 0);

    function updateCountdown() {
        const now = new Date();
        const timeDifference = targetDate - now;

        // 날짜 포맷팅
        const formattedDate = formatDate(targetDate);
        targetDateDiv.textContent = formattedDate;

        if (timeDifference <= 0) {
            // 이미 지난 경우 또는 정확히 그 순간
            if (Math.abs(timeDifference) < 1000) {
                // 정확히 11,111일인 경우 (1초 이내)
                resultCard.style.display = 'none';
                celebrationDiv.style.display = 'block';
            } else {
                // 이미 지난 경우
                const daysPassed = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60 * 24));
                resultCard.style.display = 'block';
                celebrationDiv.style.display = 'none';
                countdownDiv.innerHTML = `<div class="d-day-number passed">D+${daysPassed.toLocaleString()}</div>`;
                timeCountdownDiv.innerHTML = '';
                daysInfoDiv.textContent = `계연주님의 11,111일은 ${daysPassed.toLocaleString()}일 전에 지났습니다.`;
            }
        } else {
            // 아직 오지 않은 경우
            resultCard.style.display = 'block';
            celebrationDiv.style.display = 'none';

            // 일, 시, 분, 초 계산
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

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
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[date.getDay()];
        
        return `${year}년 ${month}월 ${day}일 (${weekday})`;
    }

    // 초기 계산
    updateCountdown();

    // 1초마다 실시간 업데이트
    setInterval(updateCountdown, 1000);
    
    // 방명록 기능
    const guestNameInput = document.getElementById('guestName');
    const guestMessageInput = document.getElementById('guestMessage');
    const submitGuestbookBtn = document.getElementById('submitGuestbook');
    const guestbookList = document.getElementById('guestbookList');
    
    // 방명록 불러오기
    function loadGuestbook() {
        const guestbook = JSON.parse(localStorage.getItem('guestbook') || '[]');
        guestbookList.innerHTML = '';
        
        if (guestbook.length === 0) {
            guestbookList.innerHTML = '<p class="no-message">아직 방명록이 없습니다. 첫 번째 메시지를 남겨주세요! 💕</p>';
            return;
        }
        
        // 최신순으로 정렬
        guestbook.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        guestbook.forEach(function(entry, index) {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'guestbook-entry';
            entryDiv.dataset.index = index;
            entryDiv.innerHTML = `
                <div class="entry-header">
                    <div class="entry-info">
                        <span class="entry-name">${escapeHtml(entry.name)}</span>
                        <span class="entry-date">${formatGuestbookDate(entry.date)}</span>
                    </div>
                    <button class="delete-btn" data-id="${entry.id || entry.date}">🗑️</button>
                </div>
                <div class="entry-message">${escapeHtml(entry.message)}</div>
            `;
            guestbookList.appendChild(entryDiv);
        });
        
        // 삭제 버튼 이벤트 리스너 추가
        document.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const entryId = this.dataset.id;
                deleteGuestbookEntry(entryId);
            });
        });
    }
    
    // HTML 이스케이프 (XSS 방지)
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 방명록 날짜 포맷팅
    function formatGuestbookDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }
    
    // 방명록 저장
    function saveGuestbook(name, message) {
        const guestbook = JSON.parse(localStorage.getItem('guestbook') || '[]');
        const entryId = Date.now().toString(); // 고유 ID 생성
        guestbook.push({
            id: entryId,
            name: name,
            message: message,
            date: new Date().toISOString()
        });
        localStorage.setItem('guestbook', JSON.stringify(guestbook));
        loadGuestbook();
    }
    
    // 방명록 삭제
    function deleteGuestbookEntry(entryId) {
        if (!confirm('정말 이 방명록을 삭제하시겠습니까?')) {
            return;
        }
        
        const guestbook = JSON.parse(localStorage.getItem('guestbook') || '[]');
        const filteredGuestbook = guestbook.filter(function(entry) {
            // 기존 데이터와의 호환성을 위해 id가 없으면 date로 비교
            return (entry.id || entry.date) !== entryId;
        });
        localStorage.setItem('guestbook', JSON.stringify(filteredGuestbook));
        loadGuestbook();
    }
    
    // 방명록 등록 버튼 클릭
    submitGuestbookBtn.addEventListener('click', function() {
        const name = guestNameInput.value.trim();
        const message = guestMessageInput.value.trim();
        
        if (!name) {
            alert('이름을 입력해주세요!');
            guestNameInput.focus();
            return;
        }
        
        if (!message) {
            alert('메시지를 입력해주세요!');
            guestMessageInput.focus();
            return;
        }
        
        saveGuestbook(name, message);
        guestNameInput.value = '';
        guestMessageInput.value = '';
        alert('방명록이 등록되었습니다! 💕');
    });
    
    // Enter 키로도 등록 가능
    guestMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitGuestbookBtn.click();
        }
    });
    
    // 초기 방명록 불러오기
    loadGuestbook();
});

