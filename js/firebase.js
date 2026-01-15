// Gerekli kütüphaneleri CDN üzerinden çekiyoruz
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
        import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

        // Senin verdiğin Firebase Konfigürasyonu
        const firebaseConfig = {
            apiKey: "AIzaSyAZOjnII9CsGUqbccQk_3DfKWkukcCXfkY",
            authDomain: "promptmainfeedback.firebaseapp.com",
            projectId: "promptmainfeedback",
            storageBucket: "promptmainfeedback.firebasestorage.app",
            messagingSenderId: "381892917952",
            appId: "1:381892917952:web:5388757fa3b92ab2308b25",
            measurementId: "G-TDZ2MP7BB3"
        };

        // Firebase'i Başlat
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app); // Analitik servisi (Opsiyonel kullanım için)
        const db = getFirestore(app);        // Veritabanı servisi (Zorunlu)

        // Global finishGame fonksiyonunu Firebase'e bağla
        window.finishGame = async function () {
            // Son verileri al
            window.userData.feedback = document.getElementById('inpFeedback').value;

            // Görünmez Veri Madenciliği
            window.userData.deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
            window.userData.screenWidth = window.innerWidth;
            window.userData.timestamp = serverTimestamp(); // Sunucu zamanı

            console.log("Gönderiliyor...", window.userData);

            const btn = document.querySelector('.btn-finish');
            if (btn) {
                btn.innerText = "Gönderiliyor... ⏳";
                btn.style.opacity = "0.7";
                btn.style.pointerEvents = "none";
            }

            try {
                // Firebase'e Ekle ('feedbacks' koleksiyonuna)
                await addDoc(collection(db, "feedbacks"), window.userData);
                console.log("Veri başarıyla kaydedildi!");
                window.goToStep(10); // Teşekkür ekranına git
            } catch (e) {
                console.error("Hata:", e);
                alert("Veri gönderilemedi. İnternetini kontrol et.");
                if (btn) { btn.innerText = "Tekrar Dene"; btn.style.pointerEvents = "auto"; btn.style.opacity = "1"; }
            }
        }