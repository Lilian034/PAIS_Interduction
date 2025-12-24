// ========================================
// 科技感特效 JavaScript - AIVA 專題網站
// ========================================

// 1. 滾動動畫 - 元素進入視窗時淡入
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 初始化滾動動畫
document.addEventListener('DOMContentLoaded', () => {
    // 為所有卡片添加初始樣式和動畫
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        animateOnScroll.observe(card);
    });

    // 為section標題添加動畫
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        header.style.transition = 'all 0.8s ease';
        animateOnScroll.observe(header);
    });
});

// 2. 滑鼠跟隨光效
// ========================================
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// 創建光效元素
const createCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    return cursor;
};

const cursorGlow = createCursor();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 平滑跟隨動畫
const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    cursorGlow.style.left = cursorX - 10 + 'px';
    cursorGlow.style.top = cursorY - 10 + 'px';

    requestAnimationFrame(animateCursor);
};
animateCursor();

// 3. 卡片3D傾斜效果
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});

// 4. 粒子背景效果
// ========================================
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;

        this.setup();
        this.createParticles();
        this.animate();
    }

    setup() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和繪製粒子
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 邊界檢測
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // 繪製粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 243, 255, 0.3)';
            this.ctx.fill();
        });

        // 繪製連線
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 初始化粒子系統
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});

// 5. 導航欄智能顯示/隱藏
// ========================================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // 向下滾動 - 隱藏導航欄
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // 向上滾動 - 顯示導航欄
        navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;

    // 滾動時改變背景透明度
    if (scrollTop > 50) {
        navbar.style.background = 'rgba(44, 62, 80, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    }
});

// 確保導航欄有過渡效果
if (navbar) {
    navbar.style.transition = 'all 0.3s ease';
}

// 6. 按鈕懸停時的漣漪效果
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.cta-button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// 添加漣漪動畫CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .cta-button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// 7. 頁面加載進度條
// ========================================
const createLoadingBar = () => {
    const loadingBar = document.createElement('div');
    loadingBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--neon-cyan), var(--neon-blue));
        box-shadow: 0 0 10px var(--neon-cyan);
        z-index: 10000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(loadingBar);
    return loadingBar;
};

window.addEventListener('load', () => {
    const loadingBar = createLoadingBar();
    let width = 0;

    const interval = setInterval(() => {
        width += 10;
        loadingBar.style.width = width + '%';

        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingBar.style.opacity = '0';
                setTimeout(() => loadingBar.remove(), 300);
            }, 200);
        }
    }, 30);
});

// 8. Logo 呼吸光效
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const logoIcon = document.querySelector('.logo-icon');
    if (logoIcon) {
        let glowIntensity = 0.4;
        let direction = 1;

        setInterval(() => {
            glowIntensity += direction * 0.02;
            if (glowIntensity >= 0.8 || glowIntensity <= 0.4) {
                direction *= -1;
            }
            logoIcon.style.boxShadow = `0 0 ${20 + glowIntensity * 30}px rgba(0, 243, 255, ${glowIntensity})`;
        }, 50);
    }
});

console.log('🚀 AIVA 科技感特效已加載');
