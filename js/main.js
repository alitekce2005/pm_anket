// --- GLOBAL DEĞİŞKENLERİ WINDOW NESNESİNE SABİTLİYORUZ (HATA ÇÖZÜMÜ) ---
        window.userData = {
            role: 'student', name: '', uni: '', grade: '', dept: '', job: '', sector: '', age: 22,
            stars: 0, dart: 0, bones: 0, golf: 0, nps: 0,
            flower: 0, favorites: [], tags: [], feedback: ''
        };
        window.currentStep = 1;

        // --- SAYFA GEÇİŞ VE VALIDASYON ---
        window.goToStep = function (stepNum) {
            // İleri gidiyorsa VALIDATION yap
            if (stepNum > window.currentStep) {
                if (!window.validateStep(window.currentStep)) return;
            }

            if (stepNum === 2) window.saveStep1();

            if (stepNum === 3) {
                const board = document.getElementById('dartBoard');
                if (board.getElementsByTagName('svg').length === 0) window.drawDartboard();
            }
            if (stepNum === 5) { setTimeout(window.initGolfGame, 200); }
            if (stepNum === 8) { setTimeout(window.initDJSlider, 200); }

            if (stepNum === 9) {
                document.getElementById('sumStars').innerText = window.userData.stars + "⭐";
                document.getElementById('sumDart').innerText = window.userData.dart;
                document.getElementById('sumBones').innerText = window.userData.bones;
                document.getElementById('sumGolf').innerText = window.userData.golf;
                document.getElementById('sumFlower').innerText = window.userData.flower;
                document.getElementById('sumNps').innerText = window.userData.nps;
            }
            if (stepNum === 10) { window.startFinalConfetti(); }

            window.changeSlide(stepNum);
        }

        window.validateStep = function (step) {
            let isValid = true;
            if (step === 1) {
                const name = document.getElementById('inpName').value.trim();
                if (!name) { markError('inpName'); isValid = false; } else { clearError('inpName'); }

                if (window.userData.role === 'student') {
                    if (!document.getElementById('inpUni').value) isValid = false;
                } else {
                    if (!document.getElementById('inpJob').value) isValid = false;
                }
            }
            else if (step === 2 && window.userData.stars === 0) isValid = false;
            else if (step === 3 && window.userData.dart === 0) isValid = false;
            else if (step === 4 && window.userData.bones === 0) isValid = false;
            else if (step === 5 && window.userData.golf === 0) isValid = false;
            else if (step === 6 && window.userData.flower === 0) isValid = false;
            else if (step === 7 && window.userData.favorites.length === 0) isValid = false;

            if (!isValid) {
                const card = document.querySelector('.game-card');
                card.classList.remove('shake-error');
                void card.offsetWidth;
                card.classList.add('shake-error');
                if (navigator.vibrate) navigator.vibrate(200);
            }
            return isValid;
        }

        function markError(id) { document.getElementById(id).classList.add('input-error'); }
        function clearError(id) { document.getElementById(id).classList.remove('input-error'); }

        window.saveStep1 = function () {
            window.userData.name = document.getElementById('inpName').value;

            if (window.userData.role === 'student') {
                // --- ÜNİVERSİTE KONTROLÜ ---
                const selectedUni = document.getElementById('inpUni').value;
                if (selectedUni === 'Diğer') {
                    window.userData.uni = document.getElementById('inpOtherUni').value;
                } else {
                    window.userData.uni = selectedUni;
                }

                window.userData.grade = document.getElementById('inpGrade').value;
                window.userData.dept = document.getElementById('inpDept').value;
            } else {
                window.userData.job = document.getElementById('inpJob').value;

                // --- SEKTÖR KONTROLÜ (YENİ) ---
                const selectedSector = document.getElementById('inpSector').value;
                if (selectedSector === 'Diğer') {
                    // Diğer seçildiyse gizli kutudan al
                    window.userData.sector = document.getElementById('inpOtherSector').value;
                } else {
                    // Değilse listeden al
                    window.userData.sector = selectedSector;
                }
            }

            if (document.getElementById('sky').children.length === 0 && window.userData.stars === 0) window.spawnStars();
        }
        window.goBack = function () { if (window.currentStep > 1) window.changeSlide(window.currentStep - 1); }

        window.changeSlide = function (step) {
            window.currentStep = step;
            document.querySelectorAll('.slide').forEach(el => el.classList.remove('active'));
            document.getElementById('slide' + step).classList.add('active');
            const nextBtns = document.querySelectorAll('.fab-next');
            const backBtns = document.querySelectorAll('.fab-back');
            if (step === 10) {
                nextBtns.forEach(b => b.style.display = 'none');
                backBtns.forEach(b => b.style.display = 'none');
            } else {
                nextBtns.forEach(b => b.style.display = 'flex');
                if (step === 1) { backBtns.forEach(b => b.style.display = 'none'); }
                else { backBtns.forEach(b => b.style.display = 'flex'); }
            }
        }

        // --- GİRİŞ & YAŞ ---
        window.setRole = function (role, el) {
            window.userData.role = role;
            const c = document.getElementById('roleSwitch');
            document.querySelectorAll('.role-opt').forEach(o => o.classList.remove('active'));
            el.classList.add('active');
            if (role === 'pro') {
                c.classList.add('pro-mode');
                document.getElementById('studentFields').style.display = 'none';
                document.getElementById('proFields').style.display = 'block';
            } else {
                c.classList.remove('pro-mode');
                document.getElementById('studentFields').style.display = 'block';
                document.getElementById('proFields').style.display = 'none';
            }
        }
        window.checkUniStatus = function () {
            const s = document.getElementById('inpUni');
            const o = document.getElementById('inpOtherUni');
            if (s.value === 'Diğer') { o.style.display = 'block'; o.focus(); } else { o.style.display = 'none'; o.value = ''; }
        }

        // Yaş Kaydırıcı
        const scroller = document.getElementById('ageScroll');
        for (let i = 15; i <= 65; i++) {
            let e = document.createElement('div');
            e.className = 'age-item'; e.innerText = i;
            e.onclick = function () { this.scrollIntoView({ behavior: "smooth", inline: "center" }) };
            scroller.appendChild(e);
        }
        scroller.addEventListener('scroll', () => {
            const c = scroller.scrollLeft + (scroller.offsetWidth / 2);
            let closest = null; let min = Infinity;
            document.querySelectorAll('.age-item').forEach(i => {
                const d = Math.abs(c - (i.offsetLeft + i.offsetWidth / 2));
                if (d < min) { min = d; closest = i; }
            });
            if (closest) {
                document.querySelectorAll('.age-item').forEach(e => e.classList.remove('active-age'));
                closest.classList.add('active-age');
                window.userData.age = closest.innerText;
                document.getElementById('ageValDisplay').innerText = window.userData.age;
            }
        });
        window.onload = () => {
            setTimeout(() => {
                const s = Array.from(document.querySelectorAll('.age-item')).find(e => e.innerText == "22");
                if (s) { s.classList.add('active-age'); s.scrollIntoView({ inline: "center" }); }
            }, 100);
        };

        // --- YILDIZ OYUNU ---
        const totalStars = 10;
        window.spawnStars = function () {
            const s = document.getElementById('sky'); s.innerHTML = '';
            for (let i = 0; i < totalStars; i++) {
                let e = document.createElement('div');
                e.className = 'star-item'; e.innerText = '⭐'; e.id = 'star-' + i;
                e.style.top = (Math.random() * 70 + 5) + '%';
                e.style.left = (Math.random() * 70 + 10) + '%';
                e.style.animationDelay = (Math.random() * 2) + 's';
                e.onclick = function () { window.collectStar(this) };
                s.appendChild(e);
            }
        }
        window.collectStar = function (e) {
            e.style.display = 'none';
            const b = document.getElementById('basket');
            if (window.userData.stars === 0) b.innerHTML = '';
            let bs = document.createElement('div'); bs.className = 'basket-star'; bs.innerText = '⭐';
            b.appendChild(bs); b.classList.add('has-stars');
            window.userData.stars++;
            document.getElementById('starScore').innerText = window.userData.stars;
        }
        window.undoStar = function () {
            if (window.userData.stars > 0) {
                const b = document.getElementById('basket');
                b.removeChild(b.lastChild);
                window.userData.stars--;
                document.getElementById('starScore').innerText = window.userData.stars;
                const h = document.querySelectorAll('.star-item[style*="display: none"]');
                if (h.length > 0) h[0].style.display = 'block';
                if (window.userData.stars === 0) {
                    b.innerHTML = '<span style="color:#b2bec3; font-size:0.8rem;">Sepet Boş</span>';
                    b.classList.remove('has-stars');
                }
            }
        }

        // --- DART OYUNU ---
        window.drawDartboard = function () {
            const c = document.getElementById('dartBoard');
            let s = `<svg viewBox="0 0 200 200">`;
            const cl = ['#34495e', '#7f8c8d', '#95a5a6', '#34495e', '#7f8c8d', '#95a5a6', '#34495e', '#7f8c8d', '#95a5a6'];
            for (let i = 0; i < 9; i++) {
                const sa = i * 40; const ea = (i + 1) * 40;
                const sr = (sa - 90) * Math.PI / 180; const er = (ea - 90) * Math.PI / 180;
                const x1 = 100 + 100 * Math.cos(sr); const y1 = 100 + 100 * Math.sin(sr);
                const x2 = 100 + 100 * Math.cos(er); const y2 = 100 + 100 * Math.sin(er);
                const p = `M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`;
                s += `<path d="${p}" fill="${cl[i]}" stroke="white" stroke-width="2" class="dart-slice" onclick="dartHit(event, ${i + 1})"></path>`;
                const ma = sa + 20; const mr = (ma - 90) * Math.PI / 180;
                const tx = 100 + 75 * Math.cos(mr); const ty = 100 + 75 * Math.sin(mr);
                s += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" class="dart-text">${i + 1}</text>`;
            }
            s += `<circle cx="100" cy="100" r="30" fill="#e74c3c" stroke="white" stroke-width="3" class="dart-center" onclick="dartHit(event, 10)"></circle><text x="100" y="100" text-anchor="middle" dominant-baseline="middle" class="dart-text" style="font-size:18px;">10</text></svg>`;
            c.innerHTML = s + '<div class="dart-feedback" id="dartFeedback">Puanını Seç!</div>';
        }
        window.dartHit = function (e, s) {
            e.stopPropagation();
            let o = document.querySelector('.dart-hit');
            if (o) o.remove();
            window.userData.dart = s;
            let t = document.getElementById('dartFeedback');
            t.innerText = s + " Puan! ";
            if (s === 10) { t.innerText += "Mükemmel! ⚡"; t.style.color = "#2ecc71"; }
            else if (s >= 7) { t.innerText += "Gayet İyi 🚀"; t.style.color = "#27ae60"; }
            else if (s >= 4) { t.innerText += "Ortalama 🐢"; t.style.color = "#f1c40f"; }
            else { t.innerText += "Çok Yavaş 🐌"; t.style.color = "#e74c3c"; }
            let a = document.createElement('div');
            a.className = 'dart-hit'; a.innerText = '📌';
            let r = document.querySelector('.dart-container').getBoundingClientRect();
            a.style.left = (e.clientX - r.left) + 'px'; a.style.top = (e.clientY - r.top) + 'px';
            document.querySelector('.dart-container').appendChild(a);
        }

        // --- KÖPEK OYUNU ---

        let isFeeding = false; // 1. BU SATIRI EKLE (KİLİT MEKANİZMASI)

        window.feedDog = function () {
            // 2. KONTROLÜ GÜNCELLE: Hem sayı 10'dan küçük olsun HEM DE şu an besleme yapılmıyor olsun
            if (window.userData.bones < 10 && !isFeeding) {

                isFeeding = true; // 3. KİLİDİ KAPAT (Animasyon başladı, tıklamayı engelle)

                const b = document.getElementById('feedBtn');
                const d = document.getElementById('dogAnim');
                const sr = b.getBoundingClientRect();
                const er = d.getBoundingClientRect();
                const f = document.createElement('div');
                f.className = 'flying-bone';
                f.innerText = '🦴';
                f.style.left = sr.left + 'px';
                f.style.top = sr.top + 'px';
                document.body.appendChild(f);
                const tx = er.left + er.width / 2 - 20;
                const ty = er.top + er.height / 2;

                requestAnimationFrame(() => {
                    f.style.left = tx + 'px';
                    f.style.top = ty + 'px';
                    f.style.transform = 'scale(0.5) rotate(360deg)';
                });

                setTimeout(() => {
                    f.remove();
                    processBone();
                    isFeeding = false; // 4. KİLİDİ AÇ (Animasyon bitti, tekrar basılabilir)
                }, 600);
            }
        }

        // processBone, removeBone ve updateDogState fonksiyonları AYNEN KALACAK, onlara dokunmana gerek yok.
        function processBone() {
            // ... (Eski kodların aynı kalıyor) ...
            window.userData.bones++;
            updateDogState();
            const d = document.getElementById('dogAnim');
            d.classList.remove('eating');
            void d.offsetWidth;
            d.classList.add('eating');
            const p = document.getElementById('boneStack');
            let b = document.createElement('div');
            b.className = 'stacked-bone';
            b.innerText = '🦴';
            b.style.transform = 'rotate(' + (Math.random() * 40 - 20) + 'deg)';
            p.appendChild(b);
            if (window.userData.bones >= 8) {
                let h = document.createElement('div');
                h.className = 'heart-pop';
                h.innerText = '💖';
                document.getElementById('heartZone').appendChild(h);
                setTimeout(() => h.remove(), 1000);
            }
        }
        // ... removeBone ve updateDogState buranın devamında eski haliyle durmalı ...

        window.removeBone = function () {
            if (window.userData.bones > 0) {
                window.userData.bones--;
                updateDogState();
                const p = document.getElementById('boneStack');
                if (p.lastChild) p.removeChild(p.lastChild);
            }
        }
        function updateDogState() {
            document.getElementById('boneScore').innerText = window.userData.bones;
            const d = document.getElementById('dogAnim');
            let s = 1;
            if (window.userData.bones >= 8) s = 2.0;
            else if (window.userData.bones >= 4) s = 1.5;
            d.setSpeed(s);
        }

        // --- GOLF OYUNU ---
        let golfState = { isDragging: false, startX: 0, startY: 0, ballX: 0, ballY: 0, ballVX: 0, ballVY: 0, moving: false, hasShot: false };
        window.initGolfGame = function () {
            const a = document.getElementById('golfArea');
            const g = document.getElementById('gridSystem');
            g.innerHTML = '';
            for (let i = 1; i < 10; i++) {
                let l = document.createElement('div');
                l.className = 'zone-separator'; l.style.top = (i * 10) + '%';
                g.appendChild(l);
            }
            for (let i = 0; i < 10; i++) {
                let l = document.createElement('div');
                l.className = 'zone-number'; l.style.top = (i * 10) + 5 + '%';
                l.innerText = (10 - i);
                if (i === 0) { l.style.color = '#fff'; l.style.textShadow = '0 0 10px rgba(255,255,255,0.8)'; l.style.fontSize = '1.3rem'; }
                g.appendChild(l);
            }
            golfState.ballX = a.offsetWidth / 2;
            golfState.ballY = a.offsetHeight - 30;
            updateBallVis();
            const b = document.getElementById('golfBall');
            b.addEventListener('mousedown', startDrag);
            b.addEventListener('touchstart', startDrag, { passive: false });
            window.addEventListener('mousemove', moveDrag);
            window.addEventListener('touchmove', moveDrag, { passive: false });
            window.addEventListener('mouseup', endDrag);
            window.addEventListener('touchend', endDrag);
        }
        function startDrag(e) {
            if (golfState.moving || golfState.hasShot) return;
            golfState.isDragging = true;
            if (e.cancelable) e.preventDefault();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            golfState.startX = cx; golfState.startY = cy;
            const aim = document.getElementById('aimLine');
            aim.style.display = 'block';
            aim.style.left = golfState.ballX + 'px';
            aim.style.bottom = (document.getElementById('golfArea').offsetHeight - golfState.ballY) + 'px';
        }
        function moveDrag(e) {
            if (!golfState.isDragging) return;
            if (e.cancelable) e.preventDefault();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = cx - golfState.startX; const dy = cy - golfState.startY;
            const aim = document.getElementById('aimLine');
            const l = Math.min(Math.sqrt(dx * dx + dy * dy), 150);
            const ang = Math.atan2(dy, dx) * 180 / Math.PI;
            aim.style.height = l + 'px';
            aim.style.transform = `rotate(${ang - 90}deg)`;
        }
        function endDrag(e) {
            if (!golfState.isDragging) return;
            golfState.isDragging = false;
            document.getElementById('aimLine').style.display = 'none';
            const cx = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const cy = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            const dx = golfState.startX - cx; const dy = golfState.startY - cy;
            const p = 0.15;
            golfState.ballVX = dx * p; golfState.ballVY = dy * p;
            if (Math.abs(golfState.ballVX) < 1 && Math.abs(golfState.ballVY) < 1) return;
            golfState.moving = true; golfState.hasShot = true;
            requestAnimationFrame(gameLoop);
        }
        function gameLoop() {
            if (!golfState.moving) return;
            const a = document.getElementById('golfArea');
            const w = a.offsetWidth; const h = a.offsetHeight;
            golfState.ballX += golfState.ballVX; golfState.ballY += golfState.ballVY;
            golfState.ballVX *= 0.95; golfState.ballVY *= 0.95;
            if (golfState.ballX <= 10 || golfState.ballX >= w - 10) {
                golfState.ballVX = -golfState.ballVX;
                golfState.ballX = Math.max(10, Math.min(golfState.ballX, w - 10));
            }
            if (golfState.ballY <= 10 || golfState.ballY >= h - 10) {
                golfState.ballVY = -golfState.ballVY;
                golfState.ballY = Math.max(10, Math.min(golfState.ballY, h - 10));
            }
            updateBallVis();
            if (Math.abs(golfState.ballVX) < 0.1 && Math.abs(golfState.ballVY) < 0.1) {
                golfState.moving = false;
                calculateZoneScore();
            } else {
                requestAnimationFrame(gameLoop);
            }
        }
        function updateBallVis() {
            const b = document.getElementById('golfBall');
            b.style.left = golfState.ballX + 'px';
            b.style.top = golfState.ballY + 'px';
        }
        function calculateZoneScore() {
            const h = document.getElementById('golfArea').offsetHeight;
            const y = golfState.ballY;
            let pct = y / h;
            let s = 10 - Math.floor(pct * 10);
            if (s > 10) s = 10; if (s < 1) s = 1;
            window.userData.golf = s;
            let m = s + " PUAN! "; let c = "#e67e22";
            if (s === 10) { m += "MÜKEMMEL! 🏆"; c = "#27ae60"; }
            else if (s >= 8) { m += "HARİKA! 🤩"; c = "#2ecc71"; }
            else if (s >= 5) { m += "ORTALAMA 🤔"; c = "#f1c40f"; }
            else { m += "ZAYIF 😅"; c = "#e74c3c"; }
            finishGolfRound(m, c, s === 10);
        }
        function finishGolfRound(m, c, w) {
            const t = document.getElementById('golfScoreText');
            t.innerText = m; t.style.color = c;
            document.getElementById('golfResetBtn').classList.add('visible');
            if (w) {
                for (let i = 0; i < 25; i++) {
                    let e = document.createElement('div');
                    e.className = 'confetti';
                    e.style.backgroundColor = ['#f1c40f', '#e74c3c', '#2ecc71'][Math.floor(Math.random() * 3)];
                    e.style.left = Math.random() * 100 + '%'; e.style.top = '-10px';
                    document.getElementById('golfArea').appendChild(e);
                }
            }
        }
        window.resetGolf = function () {
            golfState.hasShot = false; golfState.moving = false; golfState.ballVX = 0; golfState.ballVY = 0;
            const a = document.getElementById('golfArea');
            golfState.ballX = a.offsetWidth / 2; golfState.ballY = a.offsetHeight - 30;
            updateBallVis();
            document.getElementById('golfScoreText').innerText = "Atış Yap!";
            document.getElementById('golfScoreText').style.color = "var(--grass)";
            document.getElementById('golfResetBtn').classList.remove('visible');
            document.querySelectorAll('.confetti').forEach(e => e.remove());
        }

        // --- ÇİÇEK OYUNU ---
        let flowerScore = 0;
        const flowerDescriptions = { 0: "Henüz Ekilmedi... 🌱", 1: "Asla Kullanmam 🛑", 2: "Nadiren Kullanırım 📉", 3: "Belki, İhtiyaç Olursa 🤔", 4: "Arada Sırada 🤷‍♂️", 5: "Fena Değil, Kullanırım 😐", 6: "İşime Yarar 👍", 7: "Sık Sık Kullanırım 📅", 8: "Çok Beğendim, Kullanırım 💪", 9: "Her Gün Elim Gider 🚀", 10: "Vazgeçilmezim Olur! 💎" };
        window.growFlower = function () { if (flowerScore < 10) { flowerScore++; updateFlowerVis(); } }
        window.shrinkFlower = function () { if (flowerScore > 0) { flowerScore--; updateFlowerVis(); } }
        function updateFlowerVis() {
            const flower = document.getElementById('simpleFlower');
            const scoreTxt = document.getElementById('flowerScoreDisplay');
            const descTxt = document.getElementById('flowerTextDisplay');
            const scale = 0.1 + (flowerScore * 0.14);
            flower.style.transform = `scale(${scale})`;
            scoreTxt.innerText = `${flowerScore}/10`;
            descTxt.innerText = flowerDescriptions[flowerScore];
            if (flowerScore === 0) { scoreTxt.style.color = "#7f8c8d"; descTxt.style.color = "#7f8c8d"; }
            else if (flowerScore <= 3) { scoreTxt.style.color = "#f1c40f"; descTxt.style.color = "#f1c40f"; }
            else if (flowerScore <= 7) { scoreTxt.style.color = "#2ecc71"; descTxt.style.color = "#2ecc71"; }
            else { scoreTxt.style.color = "#27ae60"; descTxt.style.color = "#27ae60"; }
            window.userData.flower = flowerScore;
        }

        // --- HAYVANLAR ---
        window.toggleAnimal = function (animal, el) {
            el.classList.toggle('selected');
            if (window.userData.favorites.includes(animal)) {
                window.userData.favorites = window.userData.favorites.filter(a => a !== animal);
            } else {
                window.userData.favorites.push(animal);
            }
        }

        // --- DJ SLIDER ---
        let sliderDragging = false;
        window.initDJSlider = function () {
            const rail = document.getElementById('sliderRail'); const knob = document.getElementById('sliderKnob'); const fill = document.getElementById('sliderFill');
            knob.style.left = '15px'; fill.style.width = '0%'; updateSliderVibe(0);
            rail.addEventListener('mousedown', (e) => handleSliderMove(e, true)); rail.addEventListener('touchstart', (e) => handleSliderMove(e, true), { passive: false });
            window.addEventListener('mousemove', (e) => { if (sliderDragging) handleSliderMove(e); }); window.addEventListener('touchmove', (e) => { if (sliderDragging) handleSliderMove(e); }, { passive: false });
            window.addEventListener('mouseup', () => { sliderDragging = false; document.getElementById('sliderKnob').classList.remove('active'); }); window.addEventListener('touchend', () => { sliderDragging = false; document.getElementById('sliderKnob').classList.remove('active'); });
        }
        function handleSliderMove(e, isStart = false) {
            if (isStart) { sliderDragging = true; document.getElementById('sliderKnob').classList.add('active'); }
            if (e.cancelable) e.preventDefault();
            const rail = document.getElementById('sliderRail');
            const rect = rail.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const padding = 15;
            const availableWidth = rect.width - (padding * 2);
            let relativeX = clientX - rect.left;
            let valueX = relativeX - padding;
            if (valueX < 0) valueX = 0; if (valueX > availableWidth) valueX = availableWidth;
            document.getElementById('sliderKnob').style.left = (valueX + padding) + 'px';
            const fillPct = (valueX / availableWidth) * 100;
            document.getElementById('sliderFill').style.width = fillPct + '%';
            const score = Math.round((valueX / availableWidth) * 10);
            document.getElementById('scoreBubble').innerText = score;
            updateSliderVibe(score);
        }
        function updateSliderVibe(score) {
            window.userData.nps = score;
            const txt = document.getElementById('djScoreText');
            const lights = document.getElementById('discoLights');
            const booth = document.getElementById('djBooth');
            const anim = document.getElementById('djAnim');
            if (score === 0) { txt.innerText = "Ses Yok..."; lights.style.opacity = 0; anim.setSpeed(0.1); booth.classList.remove('party-mode'); }
            else if (score <= 4) { txt.innerText = "Isınıyoruz... 🎵"; lights.style.opacity = 0.3; anim.setSpeed(0.8); booth.classList.remove('party-mode'); }
            else if (score <= 8) { txt.innerText = "Parti Başladı! 🕺"; lights.style.opacity = 0.6; anim.setSpeed(1.5); booth.classList.remove('party-mode'); }
            else { txt.innerText = "YIKILIYOR! 🎉🔥"; lights.style.opacity = 1; anim.setSpeed(2.5); booth.classList.add('party-mode'); }
            txt.style.textShadow = `0 0 ${score * 3}px var(--neon-purple)`;
        }

        // --- FİNAL KONFETİ VE ETİKET ---
        window.toggleTag = function (el) {
            el.classList.toggle('selected');
            const tag = el.innerText;
            if (window.userData.tags.includes(tag)) window.userData.tags = window.userData.tags.filter(t => t !== tag);
            else window.userData.tags.push(tag);
        }
        window.startFinalConfetti = function () {
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    let c = document.createElement('div');
                    c.className = 'confetti';
                    c.style.backgroundColor = ['#6C63FF', '#FF6584', '#f1c40f', '#2ecc71'][Math.floor(Math.random() * 4)];
                    c.style.left = Math.random() * 100 + '%';
                    c.style.top = '-10px';
                    c.style.width = (Math.random() * 10 + 5) + 'px';
                    c.style.height = (Math.random() * 10 + 5) + 'px';
                    c.style.animationDuration = (Math.random() * 2 + 2) + 's';
                    document.body.appendChild(c);
                    setTimeout(() => c.remove(), 4000);
                }, i * 50);
            }
        }
        // SEKTÖR İÇİN GÖRÜNÜRLÜK KONTROLÜ
        window.checkSectorStatus = function () {
            const s = document.getElementById('inpSector');
            const o = document.getElementById('inpOtherSector');
            if (s.value === 'Diğer') {
                o.style.display = 'block';
                o.focus();
            } else {
                o.style.display = 'none';
                o.value = '';
            }
        }