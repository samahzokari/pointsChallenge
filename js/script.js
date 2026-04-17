// ==================== PIXEL CLOUD GENERATOR ====================
function createPixelCloud(size, speed, leftPos, topPos) {
  const cloudDiv = document.createElement('div');
  cloudDiv.className = `pixel-cloud float-${speed}`;
  cloudDiv.style.left = leftPos;
  cloudDiv.style.top = topPos;
  cloudDiv.style.position = 'absolute';

  if (size === 'small') {
    cloudDiv.innerHTML = `
      <div style="position:relative; width:80px; height:70px; transform:scale(1.2);">
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:30px; left:0px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:30px; left:12px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:30px; left:24px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:30px; left:36px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:30px; left:48px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:18px; left:12px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:18px; left:24px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:18px; left:36px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:6px; left:18px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:6px; left:30px;"></div>
        <div style="position:absolute; width:12px; height:12px; background:rgba(255,255,255,0.85); top:18px; left:48px;"></div>
      </div>
    `;
  } else if (size === 'medium') {
    cloudDiv.innerHTML = `
      <div style="position:relative; width:120px; height:90px; transform:scale(1.3);">
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:45px; left:0px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:45px; left:14px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:45px; left:28px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:45px; left:42px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:45px; left:56px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:45px; left:70px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:45px; left:84px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:31px; left:14px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:31px; left:28px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:31px; left:42px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:31px; left:56px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:31px; left:70px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:17px; left:28px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:17px; left:42px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:17px; left:56px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:3px; left:35px;"></div>
        <div style="position:absolute; width:14px; height:14px; background:rgba(255,255,255,0.8); top:3px; left:49px;"></div>
      </div>
    `;
  } else {
    cloudDiv.innerHTML = `
      <div style="position:relative; width:160px; height:110px; transform:scale(1.4);">
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:60px; left:0px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:60px; left:16px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:60px; left:32px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:60px; left:48px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:60px; left:64px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:60px; left:80px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:60px; left:96px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:60px; left:112px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:44px; left:16px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:44px; left:32px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:44px; left:48px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:44px; left:64px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:44px; left:80px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:44px; left:96px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:28px; left:32px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:28px; left:48px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:28px; left:64px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:28px; left:80px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:12px; left:48px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:12px; left:64px;"></div>
        <div style="position:absolute; width:16px; height:16px; background:rgba(255,255,255,0.75); top:0px; left:56px;"></div>
      </div>
    `;
  }
  return cloudDiv;
}

function generateClouds() {
  const container = document.getElementById('cloudsContainer');
  const speeds = ['slow', 'med', 'fast'];
  const sizes = ['small', 'medium', 'large'];
  for (let i = 0; i < 15; i++) {
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const speed = speeds[Math.floor(Math.random() * speeds.length)];
    const leftPos = Math.random() * 100 + '%';
    const topPos = Math.random() * 100 + '%';
    const cloud = createPixelCloud(size, speed, leftPos, topPos);
    container.appendChild(cloud);
  }
}

// ==================== CHARACTERS WITH CHANCE ABILITIES ====================
const avatars = [
  { emoji: "🍎", name: "Lucky Apple", description: "Chance of +50% points", ability: "bonus_points", badge: "popular", badgeText: "⭐ MOST PICKED" },
  { emoji: "📖", name: "Fate Tome", description: "Chance of extra life", ability: "extra_life", badge: "winrate", badgeText: "📈 89% WIN RATE" },
  { emoji: "⏰", name: "Chaos Clock", description: "Chance of time freeze", ability: "time_freeze", badge: "ai", badgeText: "🤖 AI RECOMMENDED" },
  { emoji: "📱", name: "Cash Bandit", description: "Chance of double points", ability: "double_points", badge: "popular", badgeText: "⚡ TRENDING" },
  { emoji: "😊", name: "Risky Smile", description: "Chance of +3 seconds", ability: "extra_time", badge: "winrate", badgeText: "🏆 TOP PERFORMER" }
];

let selectedAvatarIndex = 0;

function loadAvatars() {
  const grid = document.getElementById('avatarGrid');
  if (!grid) return;
  grid.innerHTML = '';
  avatars.forEach((avatar, index) => {
    const card = document.createElement('div');
    card.className = `avatar-card ${index === selectedAvatarIndex ? 'selected' : ''}`;
    card.onclick = () => selectAvatar(index);

    let badgeClass = '';
    if (avatar.badge === 'popular') badgeClass = 'popular';
    else if (avatar.badge === 'winrate') badgeClass = 'winrate';
    else if (avatar.badge === 'ai') badgeClass = 'ai';

    card.innerHTML = `
      <div class="avatar-pixel">${avatar.emoji}</div>
      <div class="avatar-name">${avatar.name}</div>
      <div class="avatar-stats">${avatar.description}</div>
      <div class="social-proof-badge ${badgeClass}">${avatar.badgeText}</div>
    `;
    grid.appendChild(card);
  });
}

function selectAvatar(index) {
  selectedAvatarIndex = index;
  loadAvatars();
}

// Screen navigation
function showNicknameScreen() {
  document.getElementById('screen-start').classList.add('hidden');
  document.getElementById('screen-nickname').classList.remove('hidden');
  loadAvatars();
}

function submitNicknameAndAvatar() {
  const nicknameInput = document.getElementById('nickname');
  const nickname = nicknameInput.value.trim();
  const errorMsg = document.getElementById('error-msg');

  if (nickname === "") {
    errorMsg.innerText = "Enter a username!";
    return;
  }

  if (nickname.length < 2) {
    errorMsg.innerText = "Username must be at least 2 characters!";
    return;
  }

  localStorage.setItem('playerName', nickname);
  localStorage.setItem('playerAvatar', avatars[selectedAvatarIndex].emoji);
  localStorage.setItem('playerAvatarName', avatars[selectedAvatarIndex].name);
  localStorage.setItem('playerAbility', avatars[selectedAvatarIndex].ability);
  localStorage.setItem('playerAbilityDesc', avatars[selectedAvatarIndex].description);

  alert(`Welcome ${nickname}! You chose ${avatars[selectedAvatarIndex].emoji} ${avatars[selectedAvatarIndex].name}\n⚡ ABILITY: ${avatars[selectedAvatarIndex].description} ⚡\n\n${avatars[selectedAvatarIndex].badgeText}!\n\nGame screen coming next!`);

  console.log("Player data saved:", {
    name: nickname,
    avatar: avatars[selectedAvatarIndex]
  });
  
  // TODO: Next screen (gameplay) will be added in next iteration
}

// ==================== EVENT LISTENERS & INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  generateClouds();
  
  const startBtn = document.getElementById('startScreenBtn');
  if (startBtn) {
    startBtn.addEventListener('click', showNicknameScreen);
  }
  
  const confirmBtn = document.getElementById('confirmCharacterBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', submitNicknameAndAvatar);
  }
});
