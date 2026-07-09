function createMusicPlayer() {
  if (document.getElementById("music-player-bar")) return;

  const playerBar = document.createElement("div");
  playerBar.id = "music-player-bar";
  playerBar.style.display = "none";
  playerBar.innerHTML = `
    <style>
      #music-player-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 56px;
        background: #060a06;
        border-top: 2px solid #234a1a;
        display: flex;
        align-items: center;
        padding: 0 12px;
        gap: 10px;
        z-index: 100;
        font-family: 'JetBrains Mono', monospace;
        box-shadow: 0 -4px 24px rgba(0,0,0,0.6), 0 -1px 0 rgba(90,224,58,0.15);
      }
      .mp-btn {
        background: #0d1c0d;
        border: 1px solid #2a4a1e;
        color: #4a9c32;
        font-family: inherit;
        font-size: 11px;
        padding: 4px 10px;
        cursor: pointer;
        letter-spacing: 1px;
        min-width: 32px;
        flex-shrink: 0;
        border-radius: 2px;
        transition: all 0.12s;
      }
      .mp-btn:hover { background: #16321a; color: #6dff42; border-color: #3a6a28; box-shadow: 0 0 8px rgba(90,224,58,0.25); }
      .mp-btn:active { transform: translateY(1px); }
      .mp-close {
        background: transparent;
        border: none;
        color: #ff5544;
        font-size: 16px;
        padding: 4px 6px;
        min-width: auto;
      }
      .mp-close:hover { background: transparent; color: #984343; }
      .mp-nav { display: flex; gap: 4px; flex-shrink: 0; }
      .mp-nav .mp-btn { font-size: 14px; padding: 4px 8px; }
      .mp-center { flex: 1; display: flex; flex-direction: column; gap: 2px; align-items: center; justify-content: center; min-width: 0; }
      .mp-title { color: #6dff42; text-shadow: 0 0 8px rgba(90,224,58,0.45); font-size: 11px; letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
      .mp-progress-wrap { width: 100%; max-width: 450px; }
      .mp-progress { width: 100%; height: 4px; background: #0d1a0d; border: 1px solid #1e3a16; cursor: pointer; border-radius: 2px; }
      .mp-progress-fill { height: 100%; background: #4a9c32; box-shadow: 0 0 8px rgba(90,224,58,0.5); width: 0%; border-radius: 2px; }
      .mp-time { color: #3a7028; font-size: 9px; letter-spacing: 1px; }
      .mp-eq { display: flex; gap: 2px; align-items: flex-end; height: 30px; flex-shrink: 0; }
      .mp-eq-bar { width: 3px; background: #4a9c32; box-shadow: 0 0 5px rgba(90,224,58,0.4); min-height: 2px; border-radius: 1px; }
      .mp-volume { width: 70px; height: 4px; background: #0d1a0d; border: 1px solid #1e3a16; flex-shrink: 0; cursor: pointer; border-radius: 2px; }
      .mp-volume-fill { height: 100%; background: #3a7028; border-radius: 2px; width: 70%; }
      .mp-playlist-dropdown { display: none; position: absolute; bottom: 56px; right: 12px; width: 280px; max-height: 200px; overflow-y: auto; background: #060a06; border: 1px solid #234a1a; box-shadow: 0 -4px 20px rgba(0,0,0,0.5); z-index: 101; }
      .mp-playlist-dropdown.show { display: block; }
      .mp-playlist-item { padding: 8px 12px; color: #4a9c32; font-size: 11px; cursor: pointer; border-bottom: 1px solid #0d1a0d; letter-spacing: 1px; display: flex; justify-content: space-between; }
      .mp-playlist-item:hover { background: #0d1a0d; color: #6dff42; }
      .mp-playlist-item.active { color: #6dff42; background: #0d1a0d; text-shadow: 0 0 6px rgba(90,224,58,0.4); }
      .mp-playlist-item .pl-num { color: #1e3a16; }
      @media (max-width: 768px) {
        #music-player-bar { height: 48px; padding: 0 8px; gap: 6px; }
        .mp-progress-wrap, .mp-volume, .mp-eq { display: none; }
      }
    </style>
    <button class="mp-btn mp-close" id="mp-close">✕</button>
    <div class="mp-nav">
      <button class="mp-btn" id="mp-prev">◁◁</button>
      <button class="mp-btn" id="mp-play">▶</button>
      <button class="mp-btn" id="mp-next">▷▷</button>
    </div>
    <div class="mp-center">
      <div class="mp-title" id="mp-title">LOADING...</div>
      <div class="mp-progress-wrap">
        <div class="mp-progress" id="mp-progress-track"><div class="mp-progress-fill" id="mp-progress-fill"></div></div>
      </div>
      <div class="mp-time" id="mp-time">--:-- / --:--</div>
    </div>
    <div class="mp-eq" id="mp-eq"></div>
    <div class="mp-volume" id="mp-volume-track"><div class="mp-volume-fill" id="mp-volume-fill"></div></div>
    <button class="mp-btn" id="mp-playlist-btn" title="Playlist">☰</button>
    <div class="mp-playlist-dropdown" id="mp-playlist-dropdown"></div>
  `;

  document.body.appendChild(playerBar);

  const eqEl = document.getElementById("mp-eq");
  const eqBars = [];
  for (let i = 0; i < 14; i++) {
    const bar = document.createElement("div");
    bar.className = "mp-eq-bar";
    bar.style.height = "2px";
    eqEl.appendChild(bar);
    eqBars.push(bar);
  }

  const audio = new Audio();
  let playlist = [];
  let currentTrack = -1;
  let isPlaying = false;
  let eqInterval;
  let neededUnmute = false;

  const musicFiles = [
    "The-Red-Circle-Le-Castle-Vania.mp3",
    "Every-Ending-Has-A-Beginning.mp3",
    "Mon fol amour.mp3",
    "Tous-les-memes.mp3",
  ];

  function buildPlaylist() {
    playlist = musicFiles.map(file => ({ name: file, url: "musics/" + file }));
    updatePlaylistUI();
    if (playlist.length > 0 && currentTrack === -1) {
      currentTrack = 0;
      audio.src = playlist[0].url;
    }
    updateUI();
  }

  function updatePlaylistUI() {
    const dropdown = document.getElementById("mp-playlist-dropdown");
    dropdown.innerHTML = playlist.map((track, i) => `
      <div class="mp-playlist-item${i === currentTrack ? ' active' : ''}" data-index="${i}">
        <span><span class="pl-num">${(i+1).toString().padStart(2,'0')}</span> ${track.name}</span>
      </div>
    `).join("");
    dropdown.querySelectorAll(".mp-playlist-item").forEach(item => {
      item.addEventListener("click", () => {
        playTrack(parseInt(item.dataset.index));
        dropdown.classList.remove("show");
      });
    });
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "--:--";
    return Math.floor(seconds/60) + ":" + Math.floor(seconds%60).toString().padStart(2,"0");
  }

  function updateUI() {
    document.getElementById("mp-play").textContent = isPlaying ? "⏸" : "▶";
    if (currentTrack >= 0 && playlist.length > 0) {
      document.getElementById("mp-title").textContent = playlist[currentTrack].name;
    }
    document.getElementById("mp-time").textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
    if (audio.duration) {
      document.getElementById("mp-progress-fill").style.width = (audio.currentTime / audio.duration * 100) + "%";
    }
    updatePlaylistUI();
  }

  const eqPhases = eqBars.map(() => Math.random() * Math.PI * 2);
  const eqSpeeds = eqBars.map(() => 0.015 + Math.random() * 0.03);

  function animateEQ() {
    eqBars.forEach((bar, i) => {
      eqPhases[i] += eqSpeeds[i];
      bar.style.height = (isPlaying ? (Math.sin(eqPhases[i]) * 0.5 + 0.5) * 26 + 3 : 2) + "px";
    });
    eqInterval = requestAnimationFrame(animateEQ);
  }

  function playTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    currentTrack = index;
    audio.src = playlist[index].url;
    audio.load();
    audio.play().then(() => { isPlaying = true; updateUI(); }).catch(() => { isPlaying = false; updateUI(); });
  }

  function tryAutoplay() {
    if (playlist.length === 0) return;
    if (currentTrack === -1) { currentTrack = 0; audio.src = playlist[0].url; }
    audio.muted = false;
    neededUnmute = true;
    audio.load();
    audio.play().then(() => {
      isPlaying = true;
      updateUI();
    }).catch(() => {
      isPlaying = false;
      updateUI();
    });
  }

  function unmuteOnFirstInteraction() {
    if (!neededUnmute) return;
    audio.muted = false;
    neededUnmute = false;
    if (audio.paused) {
      audio.play().then(() => { isPlaying = true; updateUI(); }).catch(() => {});
    }
  }

  function togglePlay() {
    if (playlist.length === 0) return;
    if (isPlaying) { audio.pause(); }
    else { playTrack(currentTrack >= 0 ? currentTrack : 0); }
  }

  audio.addEventListener("play", () => { isPlaying = true; updateUI(); });
  audio.addEventListener("pause", () => { isPlaying = false; updateUI(); });
  audio.addEventListener("timeupdate", updateUI);
  audio.addEventListener("loadedmetadata", updateUI);
  audio.addEventListener("ended", () => playTrack(currentTrack < playlist.length - 1 ? currentTrack + 1 : 0));
  audio.addEventListener("error", () => {
    setTimeout(() => { if (playlist.length > 1) playTrack((currentTrack + 1) % playlist.length); }, 2000);
  });

  document.getElementById("mp-play").addEventListener("click", togglePlay);
  document.getElementById("mp-next").addEventListener("click", () => playTrack(currentTrack < playlist.length - 1 ? currentTrack + 1 : 0));
  document.getElementById("mp-prev").addEventListener("click", () => playTrack(currentTrack > 0 ? currentTrack - 1 : playlist.length - 1));
  document.getElementById("mp-close").addEventListener("click", () => {
    audio.pause(); isPlaying = false; cancelAnimationFrame(eqInterval); playerBar.style.display = "none";
  });
  document.getElementById("mp-playlist-btn").addEventListener("click", (e) => {
    e.stopPropagation(); document.getElementById("mp-playlist-dropdown").classList.toggle("show");
  });
  document.addEventListener("click", () => document.getElementById("mp-playlist-dropdown").classList.remove("show"));
  document.getElementById("mp-progress-track").addEventListener("click", (e) => {
    if (!audio.duration) return;
    audio.currentTime = ((e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.getBoundingClientRect().width) * audio.duration;
  });
  document.getElementById("mp-volume-track").addEventListener("click", (e) => {
    audio.volume = Math.max(0, Math.min(1, (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.getBoundingClientRect().width));
    document.getElementById("mp-volume-fill").style.width = (audio.volume * 100) + "%";
  });

  // Unmute on first user interaction
  const unmuteEvents = ["click", "keydown", "scroll", "touchstart", "pointerdown"];
  const handleFirstInteraction = () => {
    unmuteOnFirstInteraction();
    unmuteEvents.forEach(ev => document.removeEventListener(ev, handleFirstInteraction));
  };
  unmuteEvents.forEach(ev => document.addEventListener(ev, handleFirstInteraction, { passive: true }));

  audio.volume = 0.7;
  buildPlaylist();
  animateEQ();

  audio.volume = 0.7;
  buildPlaylist();
  animateEQ();

  // Player stays hidden until first interaction
  // On first interaction: show bar + start muted autoplay
  const interactionEvents = ["click", "keydown", "scroll", "touchstart", "pointerdown"];
  const showAndPlay = () => {
    playerBar.style.display = "flex";
    tryAutoplay();
    interactionEvents.forEach(ev => document.removeEventListener(ev, showAndPlay));
  };
  interactionEvents.forEach(ev => document.addEventListener(ev, showAndPlay, { passive: true }));

  // Unmute on first interaction (same event, already handled above)
  const handleUnmute = () => {
    unmuteOnFirstInteraction();
    document.removeEventListener("click", handleUnmute);
    document.removeEventListener("keydown", handleUnmute);
  };
  document.addEventListener("click", handleUnmute);
  document.addEventListener("keydown", handleUnmute);

  window.showMusicPlayer = function() {
    playerBar.style.display = "flex";
    if (!isPlaying && playlist.length > 0) {
      playTrack(currentTrack >= 0 ? currentTrack : 0);
    }
  };
}

createMusicPlayer();