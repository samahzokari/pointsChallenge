document.addEventListener('DOMContentLoaded', function() {

  // ========== CLOUDS GENERATION ==========
  function generateClouds() {
    const container = document.getElementById('cloudsContainer');
    if (!container) return;
    container.innerHTML = '';
    const speeds = ['slow', 'med', 'fast'];
    const sizes = ['small', 'medium', 'large'];
    for (let i = 0; i < 22; i++) {
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const speed = speeds[Math.floor(Math.random() * speeds.length)];
      const width = size === 'small' ? 55 : (size === 'medium' ? 85 : 120);
      const height = size === 'small' ? 40 : (size === 'medium' ? 55 : 70);
      const cloud = document.createElement('div');
      cloud.className = `pixel-cloud float-${speed}`;
      cloud.style.width = width + 'px';
      cloud.style.height = height + 'px';
      cloud.style.left = Math.random() * 100 + '%';
      cloud.style.top = Math.random() * 100 + '%';
      container.appendChild(cloud);
    }
  }
  generateClouds();

  // ========== PLAYER DATA ==========
  let player = {
    name: "Player",
    avatar: "🍎",
    avatarName: "Lucky Apple",
    ability: "no_penalty",
    abilityDesc: "No penalty from walls"
  };
  let levelTimes = {1: 0, 2: 0, 3: 0};
  let extraChanceAvailable = true;
  let abilityUnlocked = false;

  // ========== AVATARS ==========
  const avatars = [
    { emoji: "🍎", name: "Lucky Apple", desc: "No penalty from walls", ability: "no_penalty", badge: "⭐ MOST PICKED" },
    { emoji: "📖", name: "Fate Tome", desc: "Extra chance (restart level once)", ability: "extra_chance", badge: "📈 89% WIN RATE" },
    { emoji: "⏰", name: "Chaos Clock", desc: "Time freeze (4 seconds)", ability: "time_freeze", badge: "🤖 AI RECOMMENDED" },
    { emoji: "📱", name: "Cash Bandit", desc: "Double points (30% chance)", ability: "double_points", badge: "⚡ TRENDING" },
    { emoji: "😊", name: "Risky Smile", desc: "Dash (faster movement)", ability: "dash", badge: "🏆 TOP PERFORMER" }
  ];
  let selectedAvatarIdx = 0;

  function renderAvatars() {
    const grid = document.getElementById('avatarGrid');
    if (!grid) return;
    grid.innerHTML = '';
    avatars.forEach((a, idx) => {
      const card = document.createElement('div');
      card.className = `avatar-card ${idx === selectedAvatarIdx ? 'selected' : ''}`;
      card.onclick = () => { selectedAvatarIdx = idx; renderAvatars(); };
      card.innerHTML = `
        <div class="avatar-emoji">${a.emoji}</div>
        <div class="avatar-name">${a.name}</div>
        <div class="avatar-stats">${a.desc}</div>
        <div class="social-badge">${a.badge}</div>
      `;
      grid.appendChild(card);
    });
  }

  function savePlayer() {
    localStorage.setItem('playerName', player.name);
    localStorage.setItem('playerAvatar', player.avatar);
    localStorage.setItem('playerAvatarName', player.avatarName);
    localStorage.setItem('playerAbility', player.ability);
    localStorage.setItem('playerAbilityDesc', player.abilityDesc);
  }

  function loadPlayer() {
    const n = localStorage.getItem('playerName');
    if (n) player.name = n;
    const av = localStorage.getItem('playerAvatar');
    if (av) player.avatar = av;
    const an = localStorage.getItem('playerAvatarName');
    if (an) player.avatarName = an;
    const ab = localStorage.getItem('playerAbility');
    if (ab) player.ability = ab;
    const ad = localStorage.getItem('playerAbilityDesc');
    if (ad) player.abilityDesc = ad;
  }
  loadPlayer();

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }

  function showFloatingMessage(text, color) {
    const div = document.createElement('div');
    div.className = 'floating-text';
    div.textContent = text;
    div.style.color = color || 'white';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 800);
  }

  function getLevelConfig(level) {
    if (level === 1) {
      return {
        goal: 35, goldCount: 4, redCount: 0, totalRedLimit: 0,
        goldTimerSec: 7, redTimerSec: 5, wallCount: 0, wallPenalty: false,
        repositionInterval: 9999, moveIntervalMs: 150,
        redIsMisdirection: false, aiMessage: null, showScarcity: false,
        levelName: "Easy", infoText: "Normal coins | No walls"
      };
    } else if (level === 2) {
      return {
        goal: 45, goldCount: 4, redCount: 0, totalRedLimit: 0,
        goldTimerSec: 8, redTimerSec: 5, wallCount: 9, wallPenalty: false,
        repositionInterval: 20, moveIntervalMs: 150,
        redIsMisdirection: false, aiMessage: null, showScarcity: false,
        levelName: "Medium", infoText: "Walls block your path | Coins vanish in 8 sec"
      };
    } else {
      return {
        goal: 55, goldCount: 3, redCount: 1, totalRedLimit: 25,
        goldTimerSec: 7, redTimerSec: 5, wallCount: 9, wallPenalty: true,
        repositionInterval: 15, moveIntervalMs: 150,
        redIsMisdirection: true, aiMessage: "🔴 RED COINS = DOUBLE POINTS (Limited supply!)",
        showScarcity: true,
        levelName: "Hard", infoText: "🔴 Red coins = Double points (Limited supply: 25 total) | Walls cost 1 coin"
      };
    }
  }

  // ========== ABILITY EFFECTS ==========
  let abilityActive = false;
  let dashActive = false;
  let currentGameLoopRef = null;
  let gameLoopInterval = 150;

  function applyAbilityEffect(type, points, startTimeObj) {
    if (!abilityActive) return points;
    switch (type) {
      case 'double_points':
        if (Math.random() < 0.3) {
          showFloatingMessage(`DOUBLE! +${points}`, '#ffd700');
          return points * 2;
        }
        break;
      case 'time_freeze':
        if (Math.random() < 0.3 && startTimeObj) {
          showFloatingMessage(`TIME FREEZE! +4 sec`, '#4ecdc4');
          startTimeObj.value += 4000;
        }
        break;
      case 'dash':
        if (!dashActive && Math.random() < 0.35) {
          dashActive = true;
          if (currentGameLoopRef) {
            clearInterval(currentGameLoopRef);
            currentGameLoopRef = setInterval(() => { if (gameActive && moving) move(); }, 80);
          }
          showFloatingMessage(`DASH ACTIVE! Faster movement for 5 sec`, '#ffd700');
          setTimeout(() => {
            dashActive = false;
            if (currentGameLoopRef) {
              clearInterval(currentGameLoopRef);
              currentGameLoopRef = setInterval(() => { if (gameActive && moving) move(); }, 150);
            }
            showFloatingMessage(`Dash ended`, '#888');
          }, 5000);
        }
        break;
    }
    return points;
  }

  // ========== DEBRIEF SCREEN ==========
  function showDebriefScreen(level1Time, level2Time, level3Time) {
    const totalTime = level1Time + level2Time + level3Time;
    
    const debriefModal = document.createElement('div');
    debriefModal.className = 'debrief-modal';
    debriefModal.innerHTML = `
      <div class="debrief-content">
        <h1 style="font-size:1.8rem; text-align:center; margin-bottom:5px;">🔍 Dark Patterns Debrief</h1>
        <div style="text-align:center; color:#666; margin-bottom:25px; font-size:0.85rem;">Manipulative elements used in The Points Challenge</div>

        <div class="level-stats">
          <p><strong>Your Performance</strong></p>
          <p>Level 1: 35 coins in ${formatTime(level1Time)}</p>
          <p>Level 2: 45 coins in ${formatTime(level2Time)}</p>
          <p>Level 3: 55 coins in ${formatTime(level3Time)}</p>
          <p><strong>Total Time: ${formatTime(totalTime)}</strong></p>
        </div>

        <div class="dark-pattern urgency">
          <div class="pattern-title">
            ⏰ Urgency
            <span class="badge" style="background:#e74c3c20; color:#e74c3c;">Timer Pressure</span>
          </div>
          <div class="pattern-location">📍 Appears: Level 2 & 3 — Coin timers (7-8 seconds)</div>
          <div class="pattern-behavior">🎯 Behavior influenced: Players rush to collect coins before they disappear, making faster and riskier decisions</div>
          <div class="pattern-why">📖 Why it's a dark pattern: Time pressure reduces rational thinking and forces quick actions without considering consequences</div>
        </div>

        <div class="dark-pattern scarcity">
          <div class="pattern-title">
            📦 Scarcity
            <span class="badge" style="background:#e67e2230; color:#e67e22;">Limited Supply</span>
          </div>
          <div class="pattern-location">📍 Appears: Level 3 — Only 25 red coins total, "Only X left!" warnings</div>
          <div class="pattern-behavior">🎯 Behavior influenced: Players fear missing out and prioritize red coins over gold ones</div>
          <div class="pattern-why">📖 Why it's a dark pattern: Artificial scarcity creates false urgency and perceived value where none exists</div>
        </div>

        <div class="dark-pattern misdirection">
          <div class="pattern-title">
            🎭 Misdirection
            <span class="badge" style="background:#9b59b630; color:#9b59b6;">False Promise</span>
          </div>
          <div class="pattern-location">📍 Appears: Level 3 — AI says "Red coins = Double points!" but they give 0 points</div>
          <div class="pattern-behavior">🎯 Behavior influenced: Players waste time and effort chasing red coins that provide no benefit</div>
          <div class="pattern-why">📖 Why it's a dark pattern: Deliberately misleading information causes players to make choices against their own interest</div>
        </div>

        <div class="dark-pattern socialproof">
          <div class="pattern-title">
            👥 Social Proof
            <span class="badge" style="background:#3498db30; color:#3498db;">Fake Competition</span>
          </div>
          <div class="pattern-location">📍 Appears: After each level — Fake leaderboard with fabricated top players</div>
          <div class="pattern-behavior">🎯 Behavior influenced: Players feel pressure to "catch up" to unrealistic scores, encouraging faster play</div>
          <div class="pattern-why">📖 Why it's a dark pattern: Fabricated social comparison manipulates players into feeling inadequate</div>
        </div>

        <div class="dark-pattern lossaversion">
          <div class="pattern-title">
            💸 Loss Aversion
            <span class="badge" style="background:#e8439330; color:#e84393;">Penalty Fear</span>
          </div>
          <div class="pattern-location">📍 Appears: Level 3 — Walls cost 1 coin when hit</div>
          <div class="pattern-behavior">🎯 Behavior influenced: Players avoid walls at all costs, sometimes taking longer paths or missing coins</div>
          <div class="pattern-why">📖 Why it's a dark pattern: Losses feel worse than gains; penalizing players creates fear-based decision making</div>
        </div>

        <div class="dark-pattern confirmshaming">
          <div class="pattern-title">
            😞 Confirmshaming
            <span class="badge" style="background:#f39c1230; color:#f39c12;">Guilt Trip</span>
          </div>
          <div class="pattern-location">📍 Appears: All levels — "No thanks" wheel decline messages like "I choose to lose"</div>
          <div class="pattern-behavior">🎯 Behavior influenced: Players feel guilty for skipping the wheel, increasing likelihood of spinning</div>
          <div class="pattern-why">📖 Why it's a dark pattern: Emotional manipulation makes players feel bad for making a reasonable choice</div>
        </div>

        <hr style="margin:20px 0; border:none; border-top:2px solid #eee;">
        <div style="text-align:center; font-size:0.8rem; color:#888; margin-bottom:15px;">
          These patterns were designed to subtly influence player behavior<br>
          as part of a UX dark patterns research assignment.
        </div>
        <button id="closeDebriefBtn" class="pixel-btn" style="width:100%;">CLOSE</button>
      </div>
    `;
    document.body.appendChild(debriefModal);
    
    document.getElementById('closeDebriefBtn').onclick = () => {
      debriefModal.remove();
    };
  }

  // ========== WHEEL POPUP ==========
  function showWheelPopup(abilityDesc, avatarEmoji, avatarName, currentScore) {
    return new Promise((resolve) => {
      if (currentScore < 3) {
        showFloatingMessage("Not enough coins! Need 3 coins to spin the wheel!", "#e74c3c");
        resolve('NO_COINS');
        return;
      }

      const segments = [
        { name: 'GAIN', label: 'GAIN', color: '#4ecdc4' },
        { name: 'NO LUCK', label: 'NO LUCK', color: '#e74c3c' },
        { name: 'GAIN', label: 'GAIN', color: '#4ecdc4' },
        { name: 'GAME OVER', label: 'GAME OVER', color: '#2c3e50' },
        { name: 'NO LUCK', label: 'NO LUCK', color: '#e74c3c' },
        { name: 'GAIN', label: 'GAIN', color: '#4ecdc4' },
        { name: 'NO LUCK', label: 'NO LUCK', color: '#e74c3c' }
      ];

      const modal = document.createElement('div');
      modal.className = 'wheel-modal';
      modal.innerHTML = `
        <div class="wheel-card">
          <div style="font-size: 3rem;">${avatarEmoji}</div>
          <h3>${avatarName} Ability Chance!</h3>
          <p>${abilityDesc}</p>
          <p style="color:#e74c3c; font-size:0.8rem;">Cost: 3 coins</p>
          <div class="wheel-area">
            <div class="wheel-arrow">▼</div>
            <canvas id="wheelCanvas" class="wheel-canvas" width="280" height="280"></canvas>
          </div>
          <div id="wheelResultMsg" style="margin: 15px 0; font-weight: bold;"></div>
          <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="wheelSpinBtn" class="pixel-btn" style="padding: 8px 20px;">SPIN WHEEL (3 coins)</button>
            <button id="wheelDeclineBtn" class="pixel-btn" style="background: #e74c3c;">NO THANKS</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const canvas = document.getElementById('wheelCanvas');
      const ctx = canvas.getContext('2d');
      const center = 140, radius = 140;
      const angleStep = (Math.PI * 2) / segments.length;

      for (let i = 0; i < segments.length; i++) {
        const start = i * angleStep;
        const end = (i + 1) * angleStep;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.fillStyle = segments[i].color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();

        const mid = start + angleStep / 2;
        const labelX = center + Math.cos(mid) * radius * 0.68;
        const labelY = center + Math.sin(mid) * radius * 0.68;
        ctx.save();
        ctx.translate(labelX, labelY);
        ctx.rotate(mid + Math.PI / 2);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(segments[i].label, 0, 0);
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(center, center, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();
      ctx.strokeStyle = 'gold';
      ctx.lineWidth = 2;
      ctx.stroke();

      let spinLock = false, rotation = 0;
      const spinBtn = document.getElementById('wheelSpinBtn');
      const declineBtn = document.getElementById('wheelDeclineBtn');
      const resultDiv = document.getElementById('wheelResultMsg');

      const shameMessages = [
        "No thanks, I don't like winning",
        "I choose to lose — Top players never skip!",
        "I don't want extra points — Are you sure?",
        "I prefer being a loser — Wow... okay.",
        "Skipping? That's what losers do!"
      ];
      let shameIndex = 0;

      spinBtn.onclick = () => {
        if (spinLock) return;
        spinLock = true;
        const addSpin = Math.random() * 360 + 1440;
        rotation += addSpin;
        canvas.style.transform = `rotate(${rotation}deg)`;
        setTimeout(() => {
          const finalRot = (360 - (rotation % 360)) % 360;
          const segAngle = 360 / segments.length;
          let idx = Math.floor(finalRot / segAngle);
          if (idx >= segments.length) idx = 0;
          const result = segments[idx].name;
          if (result === 'GAIN') {
            resultDiv.innerHTML = '✨ SUCCESS! Ability unlocked! ✨';
            resultDiv.style.color = '#4ecdc4';
            setTimeout(() => { modal.remove(); resolve('GAIN'); }, 1200);
          } else if (result === 'NO LUCK') {
            resultDiv.innerHTML = 'Nothing this time...';
            resultDiv.style.color = '#e74c3c';
            setTimeout(() => { modal.remove(); resolve('NO_LUCK'); }, 1200);
          } else {
            resultDiv.innerHTML = '💀 GAME OVER! 💀';
            resultDiv.style.color = '#2c3e50';
            spinBtn.disabled = true;
            declineBtn.disabled = true;
            setTimeout(() => { modal.remove(); resolve('GAME_OVER'); }, 1800);
          }
        }, 3000);
      };

      declineBtn.onclick = () => {
        const msg = shameMessages[shameIndex % shameMessages.length];
        shameIndex++;
        resultDiv.innerHTML = msg;
        resultDiv.style.color = '#e74c3c';
        spinBtn.disabled = true;
        declineBtn.disabled = true;
        setTimeout(() => { modal.remove(); resolve('DECLINE'); }, 2000);
      };
    });
  }

  // ========== LEVEL TRANSITION ==========
  function showLevelTransition(levelNum, onComplete) {
    const cfg = getLevelConfig(levelNum);
    const transitionDiv = document.createElement('div');
    transitionDiv.className = 'level-transition';
    transitionDiv.style.position = 'fixed';
    transitionDiv.style.top = '50%';
    transitionDiv.style.left = '50%';
    transitionDiv.style.transform = 'translate(-50%, -50%)';
    transitionDiv.style.zIndex = '100';

    transitionDiv.innerHTML = `
      <h1 style="font-size:2rem;">Level ${levelNum}: ${cfg.levelName}</h1>
      <div style="font-size:1.2rem; margin:20px 0;">Goal: Collect ${cfg.goal} Coins</div>
      <div style="font-size:1rem; color:#666; margin-bottom:20px;">${cfg.infoText}</div>
      <div style="background:#e8ebff; padding:15px; border-radius:12px; margin-bottom:20px;">
        <span style="font-size:2rem;">${player.avatar}</span>
        <span>${player.name}</span>
        <div style="font-size:0.8rem;">Ability: ${player.abilityDesc}</div>
      </div>
      <button id="startLevelBtn" class="pixel-btn">START LEVEL ${levelNum}</button>
    `;
    document.body.appendChild(transitionDiv);

    document.getElementById('startLevelBtn').onclick = () => {
      transitionDiv.remove();
      onComplete();
    };
  }

  // ========== END OF LEVEL LEADERBOARD ==========
  function showLevelLeaderboard(levelNum, completionTime, onRestart, onContinue) {
    const fakeNames = ['CoinMaster', 'LuckyLoot', 'RushQueen', 'SpeedDemon', 'PointKing'];
    const fakeTimes = [completionTime - 1.5, completionTime - 0.8, completionTime + 0.5, completionTime + 1.8, completionTime + 3.2].map(t => Math.max(0.5, t));
    const leaderboard = [...fakeNames.map((name, i) => ({ name, time: fakeTimes[i] })), { name: player.name, time: completionTime, isPlayer: true }];
    leaderboard.sort((a, b) => a.time - b.time);

    const leaderboardDiv = document.createElement('div');
    leaderboardDiv.className = 'result-screen';
    leaderboardDiv.style.position = 'fixed';
    leaderboardDiv.style.top = '50%';
    leaderboardDiv.style.left = '50%';
    leaderboardDiv.style.transform = 'translate(-50%, -50%)';
    leaderboardDiv.style.zIndex = '100';

    leaderboardDiv.innerHTML = `
      <h2>LEVEL ${levelNum} COMPLETE!</h2>
      <p>You completed in <strong>${formatTime(completionTime)}</strong></p>
      <div class="leaderboard-list">
        <h3>🏆 LEADERBOARD 🏆</h3>
        ${leaderboard.map((entry, idx) => `<div class="leaderboard-entry ${entry.isPlayer ? 'you' : ''}"><span>${idx + 1}. ${entry.name}</span><span>${formatTime(entry.time)}</span></div>`).join('')}
      </div>
      ${player.ability === 'extra_chance' && extraChanceAvailable && abilityUnlocked ? `<button id="restartLevelBtn" class="pixel-btn" style="background:#e74c3c;">RESTART LEVEL (Extra Chance)</button>` : ''}
      <button id="continueBtn" class="pixel-btn">CONTINUE</button>
    `;
    document.body.appendChild(leaderboardDiv);

    if (player.ability === 'extra_chance' && extraChanceAvailable && abilityUnlocked) {
      document.getElementById('restartLevelBtn').onclick = () => {
        extraChanceAvailable = false;
        abilityUnlocked = false;
        leaderboardDiv.remove();
        onRestart();
      };
    }
    document.getElementById('continueBtn').onclick = () => {
      abilityUnlocked = false;
      leaderboardDiv.remove();
      onContinue();
    };
  }

  // ========== GAME OVER SCREEN ==========
  function showGameOverScreen(levelNum, score, elapsedTime) {
    const container = document.getElementById('gameplayContainer');
    const timeStr = formatTime(elapsedTime);
    container.innerHTML = `
      <div class="result-screen">
        <h1 style="color:#e74c3c;">💀 GAME OVER 💀</h1>
        <p style="margin: 15px 0; font-size: 1.1rem;">The wheel has spoken!</p>
        <div style="background: #f5f5f5; border-radius: 24px; padding: 25px; margin: 20px 0">
          <p>You were eliminated on <strong>Level ${levelNum}</strong></p>
          <p>Coins collected: <strong>${score}</strong></p>
          <p>Time survived: <strong>${timeStr}</strong></p>
        </div>
        <button id="gameOverPlayAgain" class="pixel-btn">PLAY AGAIN</button>
      </div>
    `;
    container.classList.remove('hidden');
    document.getElementById('gameOverPlayAgain').onclick = () => {
      location.reload();
    };
  }

  // ========== VICTORY SCREEN WITH DEBRIEF BUTTON ==========
  function showVictoryScreen() {
    const container = document.getElementById('gameplayContainer');
    const totalTime = levelTimes[1] + levelTimes[2] + levelTimes[3];
    container.innerHTML = `
      <div class="result-screen" style="background: white; position: relative; z-index: 100;">
        <h1>🏆 GAME COMPLETE! 🏆</h1>
        <p style="margin: 15px 0; font-size: 1.1rem;">You mastered all levels!</p>
        <div style="background: #f5f5f5; border-radius: 24px; padding: 25px; margin: 20px 0">
          <p>Level 1: 35 coins in <strong>${formatTime(levelTimes[1])}</strong></p>
          <p>Level 2: 45 coins in <strong>${formatTime(levelTimes[2])}</strong></p>
          <p>Level 3: 55 coins in <strong>${formatTime(levelTimes[3])}</strong></p>
          <hr style="margin: 15px 0">
          <p><strong>TOTAL TIME: ${formatTime(totalTime)}</strong></p>
        </div>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <button id="viewDebriefBtn" class="pixel-btn" style="background:#9b59b6; outline-color:#8e44ad;">🔍 VIEW DARK PATTERNS</button>
          <button id="victoryPlayAgain" class="pixel-btn">PLAY AGAIN</button>
        </div>
      </div>
    `;
    container.classList.remove('hidden');
    
    document.getElementById('viewDebriefBtn').onclick = () => {
      showDebriefScreen(levelTimes[1], levelTimes[2], levelTimes[3]);
    };
    
    document.getElementById('victoryPlayAgain').onclick = () => {
      location.reload();
    };
  }

  // ========== RUN LEVEL ==========
  let gameActive = false;
  let moving = false;
  let curDir = { dx: 0, dy: 0 };

  async function runLevel(levelNum) {
    const cfg = getLevelConfig(levelNum);
    const container = document.getElementById('gameplayContainer');

    container.innerHTML = `
      <div class="game-container">
        <div class="game-panel">
          <div class="hud">
            <div class="hud-item"><div class="hud-label">COINS</div><div class="hud-value" id="lvlScore">0</div></div>
            <div class="hud-item"><div class="hud-label">TIME</div><div class="hud-value" id="lvlTimer">0s</div></div>
            <div class="hud-item"><div class="hud-label">GOAL</div><div class="hud-value">${cfg.goal}</div></div>
          </div>
          <canvas id="gameCanvas" width="400" height="400"></canvas>
          <div class="arrow-pad">
            <div></div><button data-dx="0" data-dy="-1">▲</button><div></div>
            <button data-dx="-1" data-dy="0">◀</button><button data-dx="0" data-dy="1">▼</button><button data-dx="1" data-dy="0">▶</button>
          </div>
        </div>
        <div class="info-panel">
          <div class="level-badge">LEVEL ${levelNum} · ${cfg.levelName}</div>
          ${cfg.aiMessage ? `<div class="ai-message">🤖 AI RECOMMENDS: ${cfg.aiMessage}</div>` : ''}
          <div id="scarcityMsgDiv" class="scarcity-msg hidden"></div>
          <div class="character-info">
            <div class="character-emoji">${player.avatar}</div>
            <div><strong>${player.avatarName}</strong></div>
            <div style="font-size:0.7rem">${player.abilityDesc}</div>
            <div id="abilityActiveBadge" style="color:#4ecdc4; font-size:0.7rem; margin-top:5px;"></div>
          </div>
        </div>
      </div>
    `;
    container.classList.remove('hidden');

    let score = 0;
    let redCollected = 0;
    let scarcityShown = false;
    let localAbilityActive = false;
    let playerX = 4, playerY = 4;
    let walls = [];
    let coins = [];
    let coinIntervals = [];
    let startTime = null;
    let timerInterval = null;
    let abilityPopupDone = false;
    let lastRepositionMark = 0;
    let startTimeObj = { value: null };

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    function updateScore() { document.getElementById('lvlScore').innerText = score; }
    function updateTimerDisplay(seconds) { document.getElementById('lvlTimer').innerText = formatTime(seconds); }

    function spawnCoin(isRed) {
      let forbid = new Set();
      coins.forEach(c => forbid.add(`${c.x},${c.y}`));
      walls.forEach(w => forbid.add(`${w.x},${w.y}`));
      forbid.add(`${playerX},${playerY}`);
      let x, y, attempts = 0;
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        attempts++;
      } while (attempts < 200 && forbid.has(`${x},${y}`));

      let timerSec = isRed ? cfg.redTimerSec : cfg.goldTimerSec;
      let remaining = timerSec;
      const interval = setInterval(() => {
        if (!gameActive) return;
        const coin = coins.find(c => c.x === x && c.y === y);
        if (coin) {
          remaining--;
          if (remaining <= 0) {
            clearInterval(coin.interval);
            const idx = coins.findIndex(c => c.x === x && c.y === y);
            if (idx !== -1) coins.splice(idx, 1);
            render();
            if (gameActive) {
              if (isRed) {
                redCollected = Math.min(redCollected + 1, cfg.totalRedLimit);
                if (cfg.showScarcity) {
                  let left = cfg.totalRedLimit - redCollected;
                  if (!scarcityShown && left <= 5) {
                    scarcityShown = true;
                    const msgDiv = document.getElementById('scarcityMsgDiv');
                    msgDiv.innerHTML = `⚠️ Only ${left} red coins remain! ⚠️`;
                    msgDiv.classList.remove('hidden');
                  } else if (scarcityShown) {
                    document.getElementById('scarcityMsgDiv').innerHTML = `⚠️ Only ${cfg.totalRedLimit - redCollected} red coins remain! ⚠️`;
                  }
                }
                if (redCollected < cfg.totalRedLimit) spawnCoin(true);
              } else {
                spawnCoin(false);
              }
            }
            render();
          }
        } else {
          clearInterval(interval);
        }
      }, 1000);
      coins.push({ x, y, isRed, interval, remaining });
      coinIntervals.push(interval);
      render();
    }

    function generateWalls() {
      let newWalls = [];
      let forbid = new Set();
      forbid.add(`${playerX},${playerY}`);
      coins.forEach(c => forbid.add(`${c.x},${c.y}`));
      while (newWalls.length < cfg.wallCount) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let key = `${x},${y}`;
        if (!forbid.has(key) && !newWalls.some(w => w.x === x && w.y === y)) {
          newWalls.push({ x, y });
          forbid.add(key);
        }
      }
      walls = newWalls;
    }

    function checkReposition() {
      let th = Math.floor(score / cfg.repositionInterval);
      if (th > lastRepositionMark && score >= cfg.repositionInterval) {
        lastRepositionMark = th;
        generateWalls();
        showFloatingMessage('Walls have shifted!', '#ffaa66');
        render();
      }
    }

    function render() {
      ctx.clearRect(0, 0, 400, 400);
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 40, 0);
        ctx.lineTo(i * 40, 400);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * 40);
        ctx.lineTo(400, i * 40);
        ctx.stroke();
      }
      walls.forEach(w => {
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(w.x * 40 + 2, w.y * 40 + 2, 36, 36);
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(w.x * 40 + 5, w.y * 40 + 5, 30, 30);
        ctx.fillStyle = '#5d6d6e';
        ctx.fillRect(w.x * 40 + 8, w.y * 40 + 8, 24, 24);
      });
      coins.forEach(c => {
        let cx = c.x * 40 + 20, cy = c.y * 40 + 20;
        ctx.fillStyle = c.isRed ? '#e74c3c' : '#EF9F27';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        if (!c.isRed) {
          ctx.fillStyle = '#633806';
          ctx.font = 'bold 14px monospace';
          ctx.fillText('🪙', cx - 4, cy - 2);
        }
      });
      let px = playerX * 40 + 20, py = playerY * 40 + 20;
      ctx.fillStyle = localAbilityActive ? '#4ecdc4' : '#667eea';
      ctx.beginPath();
      ctx.arc(px, py, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(player.avatar, px - 8, py + 6);
    }

    async function move() {
      if (!gameActive) return;
      if (!moving && curDir.dx === 0 && curDir.dy === 0) return;
      let nx = playerX + curDir.dx;
      let ny = playerY + curDir.dy;

      if (walls.some(w => w.x === nx && w.y === ny)) {
        let penalty = (cfg.wallPenalty && !localAbilityActive && player.ability !== 'no_penalty');
        if (penalty && score > 0) {
          score--;
          updateScore();
          showFloatingMessage('-1 COIN (WALL)!', '#e74c3c');
        } else if (penalty && score === 0) {
          showFloatingMessage('BLOCKED!', '#e74c3c');
        } else if (!penalty) {
          showFloatingMessage('BLOCKED!', '#e74c3c');
        }
        moving = false;
        return;
      }
      if (nx < 0 || nx >= 10 || ny < 0 || ny >= 10) {
        moving = false;
        return;
      }

      playerX = nx;
      playerY = ny;

      let coinIdx = coins.findIndex(c => c.x === playerX && c.y === playerY);
      if (coinIdx !== -1) {
        let coin = coins[coinIdx];
        clearInterval(coin.interval);
        coins.splice(coinIdx, 1);
        let gain = 1;
        if (coin.isRed) {
          if (cfg.redIsMisdirection) {
            gain = 0;
          }
          redCollected++;
          if (cfg.showScarcity) {
            let left = cfg.totalRedLimit - redCollected;
            if (!scarcityShown && left <= 5) {
              scarcityShown = true;
              const msgDiv = document.getElementById('scarcityMsgDiv');
              msgDiv.innerHTML = `⚠️ Only ${left} red coins remain! ⚠️`;
              msgDiv.classList.remove('hidden');
            } else if (scarcityShown) {
              document.getElementById('scarcityMsgDiv').innerHTML = `⚠️ Only ${cfg.totalRedLimit - redCollected} red coins remain! ⚠️`;
            }
          }
        }

        if (localAbilityActive) {
          gain = applyAbilityEffect(player.ability, gain, startTimeObj);
        }
        score += gain;
        updateScore();

        if (coin.isRed && redCollected < cfg.totalRedLimit) {
          spawnCoin(true);
        } else if (!coin.isRed) {
          spawnCoin(false);
        }

        checkReposition();
        render();

        if (score >= cfg.goal) {
          endLevelSuccess();
          return;
        }

        if (!abilityPopupDone && score >= 3 && score <= 12 && Math.random() < 0.35) {
          abilityPopupDone = true;
          gameActive = false;
          if (currentGameLoopRef) clearInterval(currentGameLoopRef);
          if (timerInterval) clearInterval(timerInterval);

          const result = await showWheelPopup(player.abilityDesc, player.avatar, player.avatarName, score);

          if (result === 'GAIN') {
            score = Math.max(0, score - 3);
            updateScore();
            localAbilityActive = true;
            abilityUnlocked = true;
            document.getElementById('abilityActiveBadge').innerHTML = '✨ ABILITY ACTIVE! ✨';
          } else if (result === 'GAME_OVER') {
            score = Math.max(0, score - 3);
            updateScore();
            const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
            gameActive = false;
            if (currentGameLoopRef) clearInterval(currentGameLoopRef);
            if (timerInterval) clearInterval(timerInterval);
            coinIntervals.forEach(clearInterval);
            showGameOverScreen(levelNum, score, elapsed);
            return;
          } else if (result === 'NO_LUCK') {
            score = Math.max(0, score - 3);
            updateScore();
          }

          gameActive = true;
          startTimer();
          currentGameLoopRef = setInterval(() => { if (gameActive && moving) move(); }, gameLoopInterval);
        }
      }
      render();
      moving = false;
    }

    function setDirection(dx, dy) {
      curDir = { dx, dy };
      moving = true;
      move();
    }

    function startTimer() {
      startTime = Date.now();
      startTimeObj.value = startTime;
      timerInterval = setInterval(() => {
        if (gameActive && startTime) {
          let elapsed = (Date.now() - startTime) / 1000;
          updateTimerDisplay(elapsed);
        }
      }, 100);
    }

    async function endLevelSuccess() {
      gameActive = false;
      if (currentGameLoopRef) clearInterval(currentGameLoopRef);
      if (timerInterval) clearInterval(timerInterval);
      coinIntervals.forEach(clearInterval);
      let elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
      levelTimes[levelNum] = elapsed;
      container.classList.add('hidden');

      if (levelNum === 3) {
        showVictoryScreen();
      } else {
        showLevelLeaderboard(levelNum, elapsed,
          () => { runLevel(levelNum); },
          () => { showLevelTransition(levelNum + 1, () => { runLevel(levelNum + 1); }); }
        );
      }
    }

    // INIT LEVEL
    gameActive = true;
    moving = false;
    curDir = { dx: 0, dy: 0 };
    localAbilityActive = false;
    abilityPopupDone = false;
    abilityUnlocked = false;
    score = 0;
    redCollected = 0;
    updateScore();
    document.getElementById('abilityActiveBadge').innerHTML = '';

    for (let i = 0; i < cfg.goldCount; i++) spawnCoin(false);
    for (let i = 0; i < cfg.redCount; i++) if (i < cfg.totalRedLimit) spawnCoin(true);
    if (cfg.wallCount > 0) generateWalls();
    render();
    startTimer();
    gameLoopInterval = cfg.moveIntervalMs;
    currentGameLoopRef = setInterval(() => { if (gameActive && moving) move(); }, gameLoopInterval);

    const keyHandler = (e) => {
      if (!gameActive) return;
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); setDirection(0, -1); break;
        case 'ArrowDown': e.preventDefault(); setDirection(0, 1); break;
        case 'ArrowLeft': e.preventDefault(); setDirection(-1, 0); break;
        case 'ArrowRight': e.preventDefault(); setDirection(1, 0); break;
      }
    };
    document.removeEventListener('keydown', window._levelKeyHandler);
    window._levelKeyHandler = keyHandler;
    document.addEventListener('keydown', window._levelKeyHandler);

    document.querySelectorAll('.arrow-pad button').forEach(btn => {
      btn.onclick = () => {
        if (!gameActive) return;
        let dx = parseInt(btn.getAttribute('data-dx'));
        let dy = parseInt(btn.getAttribute('data-dy'));
        setDirection(dx, dy);
      };
    });
  }

  // ========== SCREEN NAVIGATION ==========
  document.getElementById('startBtn').onclick = () => {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('charScreen').classList.remove('hidden');
    renderAvatars();
  };

  document.getElementById('confirmCharBtn').onclick = () => {
    let nick = document.getElementById('nicknameInput').value.trim();
    if (nick.length < 2) {
      document.getElementById('charError').innerText = 'Enter a username (min 2 characters)';
      return;
    }
    player.name = nick;
    player.avatar = avatars[selectedAvatarIdx].emoji;
    player.avatarName = avatars[selectedAvatarIdx].name;
    player.ability = avatars[selectedAvatarIdx].ability;
    player.abilityDesc = avatars[selectedAvatarIdx].desc;
    savePlayer();
    document.getElementById('charScreen').classList.add('hidden');

    showLevelTransition(1, () => {
      runLevel(1);
    });
  };

  renderAvatars();

});
