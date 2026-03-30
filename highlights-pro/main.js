let player; // YouTube Player
let canvas, ctx;
let activeVideo; // Current active video element (YT or Local)
let isYouTube = true;
let isTracking = false;

// Simulated Tracking Data (Time: { x, y, width, height })
const trackingPath = [
    { time: 1, x: 100, y: 150, w: 50, h: 80 },
    { time: 2, x: 150, y: 160, w: 50, h: 80 },
    { time: 3, x: 220, y: 170, w: 52, h: 82 },
    { time: 4, x: 300, y: 155, w: 50, h: 80 },
    { time: 5, x: 410, y: 140, w: 48, h: 78 }
];

function onYouTubeIframeAPIReady() {}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('ai-canvas');
    ctx = canvas.getContext('2d');
    const localVideo = document.getElementById('local-video');
    const ytArea = document.getElementById('yt-input-area');
    const localArea = document.getElementById('local-input-area');
    const modeYt = document.getElementById('mode-yt');
    const modeLocal = document.getElementById('mode-local');

    // 1. Switch Environments
    modeYt.addEventListener('click', () => {
        isYouTube = true;
        modeYt.classList.add('active');
        modeLocal.classList.remove('active');
        ytArea.style.display = 'flex';
        localArea.style.display = 'none';
        document.getElementById('player').style.display = 'block';
        localVideo.style.display = 'none';
        activeVideo = null; // Will be set by YT API
    });

    modeLocal.addEventListener('click', () => {
        isYouTube = false;
        modeLocal.classList.add('active');
        modeYt.classList.remove('active');
        localArea.style.display = 'block';
        ytArea.style.display = 'none';
        localVideo.style.display = 'block';
        document.getElementById('player').style.display = 'none';
        activeVideo = localVideo;
    });

    // 2. Load Sources
    document.getElementById('load-yt-btn').addEventListener('click', () => {
        const id = extractVideoId(document.getElementById('youtube-url').value);
        if (id) loadYouTube(id);
    });

    document.getElementById('local-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            localVideo.src = URL.createObjectURL(file);
            localVideo.load();
        }
    });

    // 3. AI Tracking Visualization
    document.getElementById('scan-btn').addEventListener('click', () => {
        const target = document.getElementById('target-player').value;
        if (!target) return alert("Enter a player name!");
        
        isTracking = true;
        document.getElementById('analysis-status').textContent = `📡 Tracking ${target.toUpperCase()}...`;
        startVisualizer();
    });

    function startVisualizer() {
        function update() {
            if (!isTracking) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get current time from active video
            let currentTime = 0;
            if (isYouTube && player && player.getCurrentTime) {
                currentTime = player.getCurrentTime();
            } else if (!isYouTube) {
                currentTime = localVideo.currentTime;
            }

            // Draw simulated box
            drawBox(currentTime);
            requestAnimationFrame(update);
        }
        
        // Sync canvas size to container
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        update();
    }

    function drawBox(time) {
        // Find the closest point in our path
        const point = trackingPath.find(p => Math.abs(p.time - (time % 10)) < 0.5);
        
        if (point) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.strokeRect(point.x, point.y, point.w, point.h);
            
            // Label
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(document.getElementById('target-player').value, point.x, point.y - 10);
            
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        }
    }

    function loadYouTube(id) {
        if (player) player.loadVideoById(id);
        else {
            player = new YT.Player('player', {
                height: '100%', width: '100%', videoId: id,
                events: { 'onReady': () => {
                    document.getElementById('analysis-status').textContent = "YouTube Ready.";
                }}
            });
        }
    }

    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
});
