// SmartRoute Script.js
// ====================

// ===== Utility Functions =====
function saveUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
}

function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find(u => u.username === username && u.password === password);
}

function setSession(username) { localStorage.setItem("currentUser", username); }
function clearSession() { localStorage.removeItem("currentUser"); }
function getCurrentUser() { return localStorage.getItem("currentUser"); }


// ===== Register Page =====
if (document.title.includes("Register")) {
  const form = document.getElementById("register-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      if (!username || !password) { alert("Isi semua data!"); return; }
      saveUser(username, password);
      alert("Akun berhasil dibuat! Silakan login.");
      window.location.href = "login.html";
    });
  }
}

// ===== Login Page =====
if (document.title.includes("Login")) {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      if (loginUser(username, password)) {
        setSession(username);
        window.location.href = "lobby.html";
      } else {
        alert("Username atau password salah!");
      }
    });
  }
}

// ===== Logout =====
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
}

// ===== Diagnostic Test =====
if (document.title.includes("Tes Diagnostik")) {
  const questions = [
    { q: "Kamu lebih suka belajar dengan...", a: ["Video", "Buku", "Praktik langsung", "Diskusi"] },
    { q: "Saat menghadapi soal sulit...", a: ["Analisis langkah", "Cari pola", "Bagi masalah", "Coba langsung"] },
    { q: "Kamu merasa paling fokus saat belajar di...", a: ["Tempat tenang", "Dengan musik", "Kelompok belajar", "Lingkungan dinamis"] },
    { q: "Kamu lebih mudah memahami jika...", a: ["Visualisasi", "Penjelasan logis", "Praktik", "Cerita/analogi"] }
  ];

  let current = 0, responses = [];
  const qText = document.getElementById("question");
  const options = document.getElementById("options");
  const nextBtn = document.getElementById("next-question");

  function showQuestion() {
    qText.textContent = questions[current].q;
    options.innerHTML = "";
    questions[current].a.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.classList.add("option-btn");
      btn.onclick = () => {
        responses.push({ question: questions[current].q, answer: opt });
        current++;
        if (current < questions.length) showQuestion();
        else finishTest();
      };
      options.appendChild(btn);
    });
  }

  function finishTest() {
    qText.textContent = "Tes selesai!";
    options.innerHTML = "";
    nextBtn.style.display = "block";
    nextBtn.textContent = "Lihat Rute Belajar";
    nextBtn.onclick = () => {
      localStorage.setItem("learningProfile", JSON.stringify(responses));
      window.location.href = "route.html";
    };
  }

  showQuestion();
}

// ===== Route Page =====
if (document.title.includes("Rute Belajar")) {
  const profile = JSON.parse(localStorage.getItem("learningProfile") || "[]");
  const resultBox = document.getElementById("result");
  if (resultBox) {
    const counts = { visual: 0, verbal: 0, kinestetik: 0, sosial: 0 };
    profile.forEach(({ answer }) => {
      if (answer.includes("Video") || answer.includes("Visual")) counts.visual++;
      else if (answer.includes("Buku") || answer.includes("Logis")) counts.verbal++;
      else if (answer.includes("Praktik")) counts.kinestetik++;
      else if (answer.includes("Diskusi") || answer.includes("Kelompok")) counts.sosial++;
    });
    const [topStyle] = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    const recommendations = {
      visual: ["Gunakan mindmap", "Tonton video", "Pakai infografis"],
      verbal: ["Baca artikel", "Buat catatan", "Gunakan analogi"],
      kinestetik: ["Lakukan simulasi", "Latihan soal", "Proyek mini"],
      sosial: ["Kelompok belajar", "Jelaskan ke orang lain", "Sesi rutin"]
    };
    resultBox.innerHTML = `
      <h3>Gaya Belajar ${topStyle}</h3>
      <ul>${recommendations[topStyle].map(i=>`<li>${i}</li>`).join("")}</ul>
    `;
  }
}