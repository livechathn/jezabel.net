/* 
  serpent-bg.js
  Hackerish constellation background for jezabel.net
*/

(function() {
    const serpentCanvas = document.createElement('canvas');
    serpentCanvas.id = 'serpent-canvas';
    serpentCanvas.style.position = 'fixed';
    serpentCanvas.style.top = '0';
    serpentCanvas.style.left = '0';
    serpentCanvas.style.width = '100%';
    serpentCanvas.style.height = '100%';
    serpentCanvas.style.zIndex = '0';
    serpentCanvas.style.pointerEvents = 'none';
    document.body.prepend(serpentCanvas);

    const sCtx = serpentCanvas.getContext('2d');
    let hackerStars = [];
    let mouse = { x: null, y: null };
    const codeWords = ['hack', 'code', 'exploit', 'root', 'shell', 'inject', 'bypass', 'node', 'link', 'jezabel'];
    
    function resizeSerpentCanvas() {
        serpentCanvas.width = window.innerWidth;
        serpentCanvas.height = window.innerHeight;
    }
    
    class HackerStar {
        constructor() {
            this.x = Math.random() * serpentCanvas.width;
            this.y = Math.random() * serpentCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.brightness = Math.random() * 0.5 + 0.5;
            this.color = Math.random() > 0.5 ? '#ff00ff' : '#00ff00';
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = serpentCanvas.width;
            if (this.x > serpentCanvas.width) this.x = 0;
            if (this.y < 0) this.y = serpentCanvas.height;
            if (this.y > serpentCanvas.height) this.y = 0;
            this.brightness += (Math.random() - 0.5) * 0.03;
            this.brightness = Math.max(0.3, Math.min(1, this.brightness));
        }
        
        draw() {
            sCtx.beginPath();
            sCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            sCtx.fillStyle = this.color + Math.floor(this.brightness * 255).toString(16).padStart(2, '0');
            sCtx.fill();
        }
    }
    
    function initHackerStars() {
        hackerStars = [];
        const starCount = Math.floor((serpentCanvas.width * serpentCanvas.height) / 7000);
        for (let i = 0; i < starCount; i++) {
            hackerStars.push(new HackerStar());
        }
    }
    
    function drawHackerConnections() {
        for (let i = 0; i < hackerStars.length; i++) {
            for (let j = i + 1; j < hackerStars.length; j++) {
                const dx = hackerStars[i].x - hackerStars[j].x;
                const dy = hackerStars[i].y - hackerStars[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 130) {
                    const opacity = (1 - distance / 130) * 0.4;
                    const lineColor = hackerStars[i].color === '#ff00ff' ? '#ff00ff' : '#00ff00';
                    sCtx.beginPath();
                    sCtx.strokeStyle = lineColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
                    sCtx.lineWidth = 0.8;
                    sCtx.moveTo(hackerStars[i].x, hackerStars[i].y);
                    sCtx.lineTo(hackerStars[j].x, hackerStars[j].y);
                    sCtx.stroke();
                }
            }
        }
    }
    
    function drawMouseHackerConnections() {
        if (mouse.x === null) return;
        hackerStars.forEach(star => {
            const dx = mouse.x - star.x;
            const dy = mouse.y - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 180) {
                const opacity = (1 - distance / 180) * 0.6;
                sCtx.beginPath();
                sCtx.strokeStyle = star.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
                sCtx.lineWidth = 1.5;
                sCtx.moveTo(mouse.x, mouse.y);
                sCtx.lineTo(star.x, star.y);
                sCtx.stroke();
            }
        });
    }
    
    function findHackerClusters() {
        const clusters = [];
        const visited = new Set();
        hackerStars.forEach((star, idx) => {
            if (visited.has(idx)) return;
            const cluster = [star];
            visited.add(idx);
            hackerStars.forEach((other, otherIdx) => {
                if (visited.has(otherIdx)) return;
                const dx = star.x - other.x;
                const dy = star.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 90) {
                    cluster.push(other);
                    visited.add(otherIdx);
                }
            });
            if (cluster.length >= 5) clusters.push(cluster);
        });
        return clusters;
    }
    
    function drawHackerClusterWords() {
        const clusters = findHackerClusters();
        clusters.forEach(cluster => {
            const centerX = cluster.reduce((sum, s) => sum + s.x, 0) / cluster.length;
            const centerY = cluster.reduce((sum, s) => sum + s.y, 0) / cluster.length;
            const word = codeWords[Math.floor(Math.random() * codeWords.length)];
            const opacity = 0.15 + Math.random() * 0.25;
            const wordColor = cluster[0].color;
            sCtx.font = '13px "JetBrains Mono", monospace';
            sCtx.fillStyle = wordColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
            sCtx.textAlign = 'center';
            sCtx.fillText(word, centerX, centerY);
        });
    }
    
    function animateSerpents() {
        sCtx.fillStyle = 'rgba(5, 0, 8, 0.08)';
        sCtx.fillRect(0, 0, serpentCanvas.width, serpentCanvas.height);
        hackerStars.forEach(star => {
            star.update();
            star.draw();
        });
        drawHackerConnections();
        drawMouseHackerConnections();
        if (Math.random() < 0.015) drawHackerClusterWords();
        requestAnimationFrame(animateSerpents);
    }
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    window.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        hackerStars.forEach(star => {
            const dx = star.x - clickX;
            const dy = star.y - clickY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 350) {
                const force = (350 - distance) / 350;
                const angle = Math.atan2(dy, dx);
                star.vx += Math.cos(angle) * force * 3; // 40% slower
                star.vy += Math.sin(angle) * force * 3;
            }
        });
    });
    
    window.addEventListener('resize', () => {
        resizeSerpentCanvas();
        initHackerStars();
    });
    
    resizeSerpentCanvas();
    initHackerStars();
    animateSerpents();
})();
