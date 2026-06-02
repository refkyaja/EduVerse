/* =========================================
   EduQuest — Shared JS Helper
   Manages state, topbar, bottomnav, theme
   ========================================= */

// ==========================================
// 1. APPLICATION STATE
// ==========================================
let appState = {
  xp: 3950,
  streak: 7,
  examsCompleted: 42,
  correctAnswers: 0,
  quests: [
    { id: 'math',   title: "Math Wizard",       desc: "Selesaikan 10 soal Matriks",          xp: 50, done: false, icon: 'calculator', color: 'text-warning bg-warning/10' },
    { id: 'book',   title: "Kutu Buku",          desc: "Pelajari 1 materi baru hari ini",     xp: 30, done: true,  icon: 'book-open',  color: 'text-success bg-success/10' },
    { id: 'sniper', title: "Sniper Akademik",    desc: "Raih skor 80+ di ujian apa pun",      xp: 80, done: false, icon: 'target',     color: 'text-brand-blue bg-brand-blue/10' }
  ],
  powerUps: { hint: 3, shield: 2, freeze: 1, combo: 5 },
  darkMode: false
};

function loadState() {
  const stored = localStorage.getItem('eduquest_state');
  if (stored) {
    try { appState = { ...appState, ...JSON.parse(stored) }; }
    catch (e) { console.error("Failed to parse stored state:", e); }
  }
  applyTheme();
}

function saveState() {
  localStorage.setItem('eduquest_state', JSON.stringify(appState));
}

// ==========================================
// 2. THEME MANAGEMENT
// ==========================================
function applyTheme() {
  const isDark = appState.darkMode;
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Sync toggle UI if it exists on the current page
  const container = document.getElementById('darkmode-icon-container');
  const label     = document.getElementById('darkmode-label');
  const track     = document.getElementById('darkmode-toggle-track');
  const thumb     = document.getElementById('darkmode-toggle-thumb');

  if (isDark) {
    if (container) container.innerHTML = '<i data-lucide="sun" class="w-5 h-5 text-warning"></i>';
    if (label)     label.textContent = 'Mode Terang';
    if (track)     track.className = 'relative w-10 h-6 rounded-full bg-primary transition-colors';
    if (thumb)     thumb.className = 'absolute top-0.5 left-[1.125rem] w-5 h-5 rounded-full bg-card shadow transition-all duration-300';
  } else {
    if (container) container.innerHTML = '<i data-lucide="moon" class="w-5 h-5 text-primary"></i>';
    if (label)     label.textContent = 'Mode Gelap';
    if (track)     track.className = 'relative w-10 h-6 rounded-full bg-muted transition-colors';
    if (thumb)     thumb.className = 'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-card shadow transition-all duration-300';
  }
  if (window.lucide) lucide.createIcons();
}

function toggleDarkMode() {
  appState.darkMode = !appState.darkMode;
  saveState();
  applyTheme();
}

// ==========================================
// 3. TOPBAR INJECTION
// ==========================================
function injectTopBar(activePage) {
  const placeholder = document.getElementById('topbar-placeholder');
  if (!placeholder) return;

  placeholder.outerHTML = `
    <nav id="global-topbar" class="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/60 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-glow">
          <i data-lucide="sparkles" class="w-5 h-5 text-primary-foreground" stroke-width="2.5"></i>
        </div>
        <span class="font-extrabold text-xl tracking-tight">EduQuest</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="bg-card border border-border rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
          <i data-lucide="flame" class="w-4 h-4 text-warning fill-warning"></i>
          <span id="topbar-streak" class="font-bold text-xs">${appState.streak}</span>
        </div>
        <div class="bg-card border border-primary/20 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
          <div class="w-3 h-3 bg-xp-gold rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
          <span id="topbar-xp" class="font-bold text-xs tabular-nums">${appState.xp.toLocaleString()} XP</span>
        </div>
        <img
          src="assets/avatar.png"
          alt="avatar"
          loading="lazy"
          class="w-10 h-10 rounded-full bg-brand-soft outline outline-2 outline-card shadow-md object-cover cursor-pointer hover:scale-105 transition-transform"
          onclick="window.location.href='profile.html'"
        />
      </div>
    </nav>
  `;
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 4. BOTTOM NAV INJECTION
// ==========================================
function injectBottomNav(activePage) {
  const placeholder = document.getElementById('bottomnav-placeholder');
  if (!placeholder) return;

  const pages = [
    { id: 'home',        icon: 'home',    label: 'Home',    href: 'index.html' },
    { id: 'materi',      icon: 'book-open', label: 'Materi', href: 'materi.html' },
    { id: 'quiz',        icon: 'swords',  label: 'Main',    href: 'quiz.html', isCenter: true },
    { id: 'leaderboard', icon: 'trophy',  label: 'Ranking', href: 'leaderboard.html' },
    { id: 'profile',     icon: 'user',    label: 'Profil',  href: 'profile.html' },
  ];

  const buttonsHtml = pages.map(p => {
    const isActive = p.id === activePage;

    if (p.isCenter) {
      return `
        <a href="${p.href}" id="nav-btn-${p.id}" class="-mt-10 flex flex-col items-center">
          <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center shadow-glow border-4 border-card text-primary-foreground animate-pulse-glow hover:scale-105 transition-transform duration-200">
            <i data-lucide="${p.icon}" class="w-7 h-7" stroke-width="2.5"></i>
          </div>
          <span class="text-[10px] font-bold text-primary mt-1">${p.label}</span>
        </a>
      `;
    }

    const activeClass   = 'flex flex-col items-center gap-1 transition-all text-primary';
    const inactiveClass = 'flex flex-col items-center gap-1 transition-all text-muted-foreground hover:text-foreground';
    const sw = isActive ? '2.5' : '2';
    const spanClass = isActive ? 'text-[10px] font-bold' : 'text-[10px] font-semibold';

    return `
      <a href="${p.href}" id="nav-btn-${p.id}" class="${isActive ? activeClass : inactiveClass}">
        <i data-lucide="${p.icon}" class="w-5 h-5" stroke-width="${sw}"></i>
        <span class="${spanClass}">${p.label}</span>
      </a>
    `;
  }).join('');

  placeholder.outerHTML = `
    <nav id="global-bottomnav" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border px-4 py-3 flex justify-between items-center z-50">
      ${buttonsHtml}
    </nav>
  `;
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 5. LEVEL / XP HELPERS
// ==========================================
function getLevelInfo(totalXp) {
  const baseLevel = 25;
  const baseXP    = 3100;
  if (totalXp >= baseXP) {
    const excess      = totalXp - baseXP;
    const levelOffset = Math.floor(excess / 1000);
    const level       = baseLevel + levelOffset;
    const progress    = excess % 1000;
    return { level, progress, max: 1000 };
  }
  const level    = Math.floor(totalXp / 150) + 1;
  const progress = totalXp % 150;
  return { level, progress, max: 150 };
}

// ==========================================
// 6. TOAST NOTIFICATION
// ==========================================
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary-glow text-white font-bold py-3 px-6 rounded-full shadow-lg z-[9999] animate-scale-in flex items-center gap-2';
  toast.innerHTML = `<i data-lucide="sparkles" class="w-5 h-5 text-xp-gold fill-xp-gold"></i> ${message}`;
  document.body.appendChild(toast);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ==========================================
// 7. PAGE BOOT
// ==========================================
function bootPage(activePage) {
  loadState();
  injectTopBar(activePage);
  injectBottomNav(activePage);
  if (window.lucide) lucide.createIcons();
}
