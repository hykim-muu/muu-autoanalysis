let player;
let canvas, ctx;
let isTracking = false;
let trackingData = [];

// API Ready
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Ready");
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('analysis-overlay');
    ctx = canvas.getContext('2d');
    const localVideo = document.getElementById('local-video');
    const statusOverlay = document.getElementById('status-overlay');

    // 1. Tab Switching
    document.getElementById('tab-yt').addEventListener('click', (e) => {
        switchTab('yt');
    });
    document.getElementById('tab-local').addEventListener('click', (e) => {
        switchTab('local');
    });

    function switchTab(type) {
        document.getElementById('tab-yt').classList.toggle('active', type === 'yt');
        document.getElementById('tab-local').classList.toggle('active', type === 'local');
        document.getElementById('yt-input').style.display = type === 'yt' ? 'flex' : 'none';
        document.getElementById('local-input').style.display = type === 'local' ? 'flex' : 'none';
        document.getElementById('player').style.display = type === 'yt' ? 'block' : 'none';
        localVideo.style.display = type === 'local' ? 'block' : 'none';
    }

    // 2. Load YouTube
    document.getElementById('btn-load-yt').addEventListener('click', () => {
        const url = document.getElementById('yt-url').value;
        const videoId = extractVideoId(url);
        if (videoId) {
            if (player) {
                player.loadVideoById(videoId);
            } else {
                player = new YT.Player('player', {
                    height: '100%', width: '100%', videoId: videoId,
                    events: { 'onReady': () => statusOverlay.textContent = "유튜브 영상 로드 완료" }
                });
            }
        }
    });

    // 3. Load Local File
    document.getElementById('video-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            localVideo.src = URL.createObjectURL(file);
            statusOverlay.textContent = "로컬 영상 로드 완료";
        }
    });

    // 4. Start AI Analysis Simulation
    document.getElementById('btn-analyze').addEventListener('click', () => {
        const target = document.getElementById('target-name').value;
        if (!target) return alert("분석할 선수 이름이나 번호를 입력하세요.");

        isTracking = true;
        statusOverlay.textContent = `📡 AI 분석 중: ${target}...`;
        statusOverlay.style.background = "rgba(255, 0, 0, 0.3)";
        statusOverlay.style.borderColor = "red";
        statusOverlay.style.color = "white";

        generateMockEvents();
        startVisualizer();
    });

    function startVisualizer() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        function render() {
            if (!isTracking) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw Random Tracking Box
            const time = Date.now() * 0.001;
            const x = (Math.sin(time) * 0.3 + 0.5) * canvas.width;
            const y = (Math.cos(time * 0.8) * 0.2 + 0.5) * canvas.height;
            
            drawBox(x, y, document.getElementById('target-name').value);
            updateStats();
            
            requestAnimationFrame(render);
        }
        render();
    }

    function drawBox(x, y, name) {
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 40, y - 60, 80, 120);
        
        ctx.fillStyle = '#00d2ff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(name, x - 35, y - 70);
        
        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00d2ff';
    }

    function updateStats() {
        document.getElementById('stat-distance').textContent = (Math.random() * 10).toFixed(1) + "km";
        document.getElementById('stat-speed').textContent = (20 + Math.random() * 15).toFixed(1) + "km/h";
    }

    function generateMockEvents() {
        const list = document.getElementById('event-list');
        list.innerHTML = `
            <div class="event-item">✅ 00:45 - 박스 안 침투</div>
            <div class="event-item">✅ 01:20 - 유효 슈팅 발생</div>
            <div class="event-item">✅ 02:15 - 전방 압박 성공</div>
        `;
        list.classList.remove('list-empty');
    }

    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
});
