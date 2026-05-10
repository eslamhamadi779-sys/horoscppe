// ===============================
// script.js - المنطق الرئيسي للموقع
// ===============================

// ===============================
// تهيئة الصفحة
// ===============================
window.addEventListener('DOMContentLoaded', () => {
    createStars();
    populateSignSelectors();
    buildSignsGrid();
    animateEntrance();
});

// ===============================
// إنشاء النجوم في الخلفية
// ===============================
function createStars() {
    const layer = document.getElementById('starsLayer');
    if (!layer) return;
    const count = 120;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 3 + 1;
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 4}s;
            animation-duration: ${2 + Math.random() * 3}s;
            opacity: ${0.3 + Math.random() * 0.7};
        `;
        layer.appendChild(star);
    }
}

// ===============================
// ملء قوائم الأبراج
// ===============================
function populateSignSelectors() {
    const sel1 = document.getElementById('sign1');
    const sel2 = document.getElementById('sign2');
    if (!sel1 || !sel2) return;

    Object.keys(zodiacData).forEach(sign => {
        const info = zodiacData[sign];
        const opt1 = document.createElement('option');
        opt1.value = sign;
        opt1.textContent = `${info.symbol} ${sign}`;
        sel1.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = sign;
        opt2.textContent = `${info.symbol} ${sign}`;
        sel2.appendChild(opt2);
    });
}

// ===============================
// بناء شبكة الأبراج
// ===============================
function buildSignsGrid() {
    const grid = document.getElementById('signsGrid');
    if (!grid) return;

    Object.keys(zodiacData).forEach(sign => {
        const info = zodiacData[sign];
        const card = document.createElement('div');
        card.classList.add('sign-card');
        card.style.setProperty('--sign-color', info.color);
        card.style.setProperty('--sign-light', info.colorLight);
        card.innerHTML = `
            <div class="sign-card-symbol">${info.symbol}</div>
            <div class="sign-card-name">${sign}</div>
            <div class="sign-card-date">${info.dateRange}</div>
            <div class="sign-card-element">${info.element}</div>
        `;
        card.addEventListener('click', () => openSignModal(sign));
        grid.appendChild(card);
    });
}

// ===============================
// معرفة البرج من تاريخ الميلاد
// ===============================
function checkZodiac() {
    const dateInput = document.getElementById('birthDate').value;
    const result = document.getElementById('result');

    if (!dateInput) {
        result.innerHTML = '⚠️ من فضلك اختر تاريخ الميلاد أولًا';
        result.classList.remove('hidden');
        result.style.borderColor = '#ff4757';
        return;
    }

    const birthDate = new Date(dateInput);
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const zodiac = getZodiac(day, month);
    const info = zodiacData[zodiac];

    result.style.setProperty('--result-color', info.color);
    result.style.borderColor = info.color;
    result.classList.remove('hidden');

    result.innerHTML = `
        <div class="result-header" style="color: ${info.color}">
            <span class="result-symbol">${info.symbol}</span>
            <span class="result-name">برجك هو: ${zodiac}</span>
        </div>
        <div class="result-grid">
            <div class="result-item">
                <span class="result-label">📅 الفترة</span>
                <span>${info.dateRange}</span>
            </div>
            <div class="result-item">
                <span class="result-label">🔥 العنصر</span>
                <span>${info.element}</span>
            </div>
            <div class="result-item">
                <span class="result-label">🪐 الكوكب</span>
                <span>${info.planet}</span>
            </div>
        </div>
        <div class="result-section">
            <div class="result-label">✨ الصفات</div>
            <p>${info.traits}</p>
        </div>
        <div class="result-section">
            <div class="result-label">⚡ نقاط الضعف</div>
            <p>${info.flaws}</p>
        </div>
        <div class="result-compat">
            <div class="compat-group">
                <div class="result-label">💚 يتوافق مع</div>
                <div class="compat-tags">
                    ${info.match.map(s => `<span class="tag tag-good" onclick="quickCompat('${zodiac}','${s}')">${zodiacData[s]?.symbol || ''} ${s}</span>`).join('')}
                </div>
            </div>
            <div class="compat-group">
                <div class="result-label">❤️ يختلف مع</div>
                <div class="compat-tags">
                    ${info.clash.map(s => `<span class="tag tag-bad">${zodiacData[s]?.symbol || ''} ${s}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="result-footer">
            <button onclick="openSignModal('${zodiac}')" style="background: ${info.color}">
                🔍 عرض تفاصيل أكثر
            </button>
        </div>
    `;

    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===============================
// حساب التوافق بين برجين
// ===============================
function updateCompatibility() {
    const sign1 = document.getElementById('sign1').value;
    const sign2 = document.getElementById('sign2').value;
    const resultDiv = document.getElementById('compatResult');

    if (!sign1 || !sign2) return;

    const info1 = zodiacData[sign1];
    const info2 = zodiacData[sign2];

    // حساب نسبة التوافق
    let score = 50; // أساسي
    let level = '';
    let levelClass = '';
    let message = '';

    if (info1.match.includes(sign2)) {
        score = Math.floor(80 + Math.random() * 18);
        level = 'توافق ممتاز 💚';
        levelClass = 'great';
        message = `${sign1} و${sign2} توافقهم رائع! يكمل كل منهم الآخر بشكل طبيعي. علاقتهم مبنية على تفاهم عميق ومشاعر صادقة.`;
    } else if (info1.clash.includes(sign2)) {
        score = Math.floor(20 + Math.random() * 20);
        level = 'توافق صعب ❤️';
        levelClass = 'hard';
        message = `${sign1} و${sign2} قد يواجهوا تحديات في الفهم المتبادل. لكن مع الصبر والحوار يمكن بناء علاقة قوية رغم الاختلافات.`;
    } else if (sign1 === sign2) {
        score = Math.floor(70 + Math.random() * 20);
        level = 'توافق النفس مع النفس 🌀';
        levelClass = 'same';
        message = `برجان متشابهان يفهمان بعض تلقائيًا، لكن قد تظهر نفس العيوب مضاعفة! يحتاجان لمن يكمل ما ينقصهما.`;
    } else {
        score = Math.floor(50 + Math.random() * 25);
        level = 'توافق متوسط 💛';
        levelClass = 'medium';
        message = `${sign1} و${sign2} علاقتهم تعتمد على الجهد المشترك. ليسوا الأكثر توافقًا ولا الأصعب — الفهم والاحترام هو مفتاحهم.`;
    }

    const barWidth = score;

    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <div class="compat-display">
            <div class="compat-signs-display">
                <div class="compat-sign-big" style="--c: ${info1.color}">
                    <div class="big-symbol">${info1.symbol}</div>
                    <div class="big-name">${sign1}</div>
                </div>
                <div class="compat-heart">💞</div>
                <div class="compat-sign-big" style="--c: ${info2.color}">
                    <div class="big-symbol">${info2.symbol}</div>
                    <div class="big-name">${sign2}</div>
                </div>
            </div>
            <div class="compat-score-area">
                <div class="score-label">${level}</div>
                <div class="score-bar-bg">
                    <div class="score-bar ${levelClass}" style="width: ${barWidth}%"></div>
                </div>
                <div class="score-number">${score}%</div>
            </div>
            <div class="compat-message">${message}</div>
        </div>
    `;

    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===============================
// توافق سريع من بطاقة البرج
// ===============================
function quickCompat(sign1, sign2) {
    document.getElementById('sign1').value = sign1;
    document.getElementById('sign2').value = sign2;
    document.getElementById('compatibility').scrollIntoView({ behavior: 'smooth' });
    setTimeout(updateCompatibility, 400);
}

// ===============================
// فتح modal تفاصيل البرج
// ===============================
function openSignModal(sign) {
    const info = zodiacData[sign];
    const modal = document.getElementById('signModal');
    const body = document.getElementById('modalBody');

    body.innerHTML = `
        <div class="modal-sign-header" style="--mc: ${info.color}; --ml: ${info.colorLight}">
            <div class="modal-symbol">${info.symbol}</div>
            <div class="modal-sign-info">
                <h2>${sign} ${info.emoji}</h2>
                <p>${info.dateRange}</p>
                <p>${info.element} &nbsp;|&nbsp; ${info.planet}</p>
            </div>
        </div>

        <div class="modal-desc">${info.description}</div>

        <div class="modal-sections">
            <div class="modal-section">
                <h3>✨ الصفات</h3>
                <p>${info.traits}</p>
            </div>
            <div class="modal-section">
                <h3>💪 نقاط القوة</h3>
                <ul>${info.strengths.map(s => `<li>✅ ${s}</li>`).join('')}</ul>
            </div>
            <div class="modal-section">
                <h3>⚡ نقاط الضعف</h3>
                <ul>${info.weaknesses.map(w => `<li>⚠️ ${w}</li>`).join('')}</ul>
            </div>
        </div>

        <div class="modal-compat">
            <h3>💫 التوافق مع الأبراج</h3>
            <div class="modal-compat-grid">
                ${Object.keys(zodiacData).map(s => {
                    const isMatch = info.match.includes(s);
                    const isClash = info.clash.includes(s);
                    const isSelf = s === sign;
                    let cls = 'compat-neutral';
                    let icon = '💛';
                    if (isMatch) { cls = 'compat-match'; icon = '💚'; }
                    if (isClash) { cls = 'compat-clash'; icon = '🔴'; }
                    if (isSelf) { cls = 'compat-self'; icon = '🔵'; }
                    return `
                        <div class="compat-item ${cls}" onclick="closeModal(); quickCompat('${sign}','${s}')">
                            <span>${zodiacData[s].symbol}</span>
                            <span>${s}</span>
                            <span>${icon}</span>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="compat-legend">
                <span>💚 توافق ممتاز</span>
                <span>💛 متوسط</span>
                <span>🔴 تحدٍّ</span>
                <span>🔵 نفس البرج</span>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// ===============================
// إغلاق الـ modal
// ===============================
function closeModal() {
    document.getElementById('signModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// إغلاق بمفتاح Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===============================
// أنيميشن الدخول
// ===============================
function animateEntrance() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(s => {
        s.classList.add('fade-section');
        observer.observe(s);
    });
}
