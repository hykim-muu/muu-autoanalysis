// Stazit Football Agency - main.js

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = 'Light Mode';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        }
    });

    // AI Analysis Logic
    const analyzeBtn = document.getElementById('analyze-btn');
    const statusDiv = document.getElementById('analysis-status');
    const resultDiv = document.getElementById('heatmap-result');
    const canvas = document.getElementById('heatmap-canvas');

    analyzeBtn.addEventListener('click', () => {
        const url = document.getElementById('youtube-url').value;
        if (!url) {
            alert('Please enter a YouTube URL');
            return;
        }

        // Reset and Show Loading
        resultDiv.classList.add('hidden');
        statusDiv.classList.remove('hidden');

        // Simulate AI Analysis Time (3 seconds)
        setTimeout(() => {
            statusDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            drawHeatmap();
        }, 3000);
    });

    function drawHeatmap() {
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, w, h);

        // Simple Random Heatmap Simulation
        for(let i = 0; i < 50; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const radius = 20 + Math.random() * 40;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, 'rgba(255, 165, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    console.log("Stazit Football Agency website loaded with AI Heatmap Prototype.");
});
