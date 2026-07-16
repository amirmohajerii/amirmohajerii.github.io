// ============ TERMINAL MODULE ============
const terminal = document.getElementById("terminal");
const bootScreen = document.getElementById("boot-screen");

let cwd = "/home";
let activeProcess = null;

// ============ FILESYSTEM ============
const fs = {

      home: {"skills.txt": `<div class="skills-grid" style="display:grid; grid-template-columns:repeat(6, 1fr); gap:10px; max-width:580px; font-family:'custom', monospace;">
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
        <img src="icons/csharp-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">C#</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/dotnetCore.png" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">ASP.NET Core</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/linux-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">Linux</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/sqldeveloper-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">SQL</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/docker-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">Docker</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/networking.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">Network</span>
    </div>

    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/redis-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">Redis</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/rabbitmq-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">RabbitMQ</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/grpc-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">gRPC</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/git-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">Git</span>
    </div>

    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/python-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">Python</span>
    </div>
    
    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
      <img src="icons/mongodb-original.svg" style="width:48px; height:48px;">
      <span style="font-size:10px; color:#c0c0c0;">MongoDB</span>
    </div>

  </div>`}
    };

function getDir(path) {
  let parts = path.split("/").filter(Boolean);
  let cur = fs;
  for (let p of parts) {
    cur = cur[p];
    if (cur === undefined) throw new Error("Path not found");
  }
  return cur;
}

// ============ OUTPUT ============
function print(text = "") {
  terminal.innerHTML += text + "\n";
  terminal.scrollTop = terminal.scrollHeight;
}

function printBoot(text = "") {
  bootScreen.innerHTML += text + "\n";
  bootScreen.scrollTop = bootScreen.scrollHeight;
}

// ============ PROMPT ============
function prompt() {
  const div = document.createElement("div");
  div.className = "line";

  const p = document.createElement("span");
  p.className = "prompt";
  p.textContent = `user@site:${cwd}$`;

  const input = document.createElement("input");
  input.autofocus = true;

  input.onkeydown = e => {
    if (e.key === "Enter") {
      const cmd = input.value;
      div.removeChild(input);
      div.textContent += cmd;
      handleCommand(cmd.trim());
    }
  };

  div.appendChild(p);
  div.appendChild(input);
  terminal.appendChild(div);
  input.focus();
  setTimeout(() => {
    input.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 50);
}

// ============ COMMAND HANDLER ============
function handleCommand(cmd) {
  if (!cmd) return prompt();

  let args = cmd.split(" ");
  let base = args[0];

  switch (base) {
    case "ls":
      ls();
      break;
    case "cd":
      cd(args[1]);
      break;
    case "cat":
      cat(args[1]);
      break;
    case "pwd":
      print(cwd);
      break;
    case "clear":
      terminal.innerHTML = "";
      printBanner();
      break;
    case "help":
      help();
      break;
    case "donut":
      donut();
      break;
    case "exit":
      stopProcess();
      break;
    case "music":
    case "musicplayer":
      const bar = document.getElementById("music-player-bar");
      if (bar) {
        bar.style.display = "flex";
        print("Music player opened.");
      } else {
        print("Music player not found.");
      }
      break;
    case "mkdir":
      print(mkdir(args[1]));
      break;
    case "touch":
      print(touch(args[1], args.slice(2).join(" ") || ""));
      break;
    case "rm":
      print(rm(args[1]));
      break;
    case "write":
      print(writeFile(args[1], args.slice(2).join(" ")));
      break;
    case "mv":
      print(mv(args[1], args[2]));
      break;
    default:
      print(`command not found: ${base}`);
  }

  prompt();
}

// ============ COMMANDS ============
function ls() {
  let dir = getDir(cwd);
  print(Object.keys(dir).join("    "));
}

function cd(path) {
  if (!path || path === "~") { cwd = "/home"; return; }
  if (path === ".." || path === "../") {
    let parts = cwd.split("/").filter(Boolean);
    parts.pop();
    cwd = "/" + parts.join("/");
    if (cwd === "/") cwd = "/home";
    return;
  }
  if (path.startsWith("../")) {
    let ups = path.split("/").filter(p => p === "..").length;
    let parts = cwd.split("/").filter(Boolean);
    parts = parts.slice(0, parts.length - ups);
    cwd = "/" + parts.join("/");
    if (cwd === "/") cwd = "/home";
    return;
  }
  let newPath = path.startsWith("/") ? path : cwd + "/" + path;
  try {
    let d = getDir(newPath);
    if (typeof d === "object") cwd = newPath;
    else print("Not a directory");
  } catch {
    print("No such directory");
  }
}

function cat(file) {
  let dir = getDir(cwd);
  if (!dir[file]) return print("No such file");
  let content = dir[file];
  if (typeof content === "string" && content.trim().startsWith("<div")) {
    const temp = document.createElement("div");
    temp.innerHTML = content;
    while (temp.firstChild) {
      terminal.appendChild(temp.firstChild);
    }
    terminal.scrollTop = terminal.scrollHeight;
  } else if (content.endsWith?.(".webp") || content.endsWith?.(".png") || content.endsWith?.(".gif")) {
    let img = document.createElement("img");
    img.src = content;
    terminal.appendChild(img);
  } else {
    print(content);
  }
}

function help() {
  print(`Available commands:
ls         -> list directory
cd DIR     -> change directory
cat FILE   -> read file
pwd        -> show path
mkdir DIR  -> create directory
touch FILE -> create file
rm NAME    -> remove file/directory
write FILE -> write to file
mv OLD NEW -> move/rename
clear      -> clear screen
help       -> show commands
donut      -> spinning donut animation
music      -> reopen music player`);
}

function stopProcess() {
  if (activeProcess) {
    clearInterval(activeProcess);
    activeProcess = null;
    const donutEl = document.getElementById("donut-container");
    if (donutEl) donutEl.remove();
    print("Process terminated.");
  }
}

function donut() {
  if (activeProcess) clearInterval(activeProcess);
  let A = 0, B = 0;
  const width = 40, height = 22;
  const chars = ".,-~:;=!*#$@";
  const donutContainer = document.createElement("div");
  donutContainer.id = "donut-container";
  donutContainer.style.whiteSpace = "pre";
  donutContainer.style.fontFamily = "monospace";
  donutContainer.style.fontSize = "12px";
  donutContainer.style.lineHeight = "1.2";
  terminal.appendChild(donutContainer);
  terminal.scrollTop = terminal.scrollHeight;
  activeProcess = setInterval(() => {
    let z = Array(width * height).fill(0);
    let b = Array(width * height).fill(" ");
    for (let j = 0; j < 6.28; j += 0.07) {
      for (let i = 0; i < 6.28; i += 0.02) {
        let c = Math.sin(i), d = Math.cos(j);
        let e = Math.sin(A), f = Math.sin(j);
        let g = Math.cos(A), h = d + 2;
        let D = 1 / (c * h * e + f * g + 5);
        let l = Math.cos(i), m = Math.cos(B), n = Math.sin(B);
        let t = c * h * g - f * e;
        let x = Math.floor(width / 2 + 30 * D * (l * h * m - t * n));
        let y = Math.floor(height / 2 + 15 * D * (l * h * n + t * m));
        let o = x + width * y;
        let N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));
        if (y >= 0 && y < height && x >= 0 && x < width && D > z[o]) {
          z[o] = D;
          b[o] = chars[Math.max(0, N)];
        }
      }
    }
    let output = "";
    for (let k = 0; k < width * height; k++) {
      output += k % width === 0 ? "\n" : b[k];
    }
    donutContainer.textContent = output;
    A += 0.04; B += 0.02;
  }, 50);
}

// ============ FILE OPERATIONS ============
function mkdir(path) {
  if (!path) return "Usage: mkdir <directory>";
  let dir = getDir(cwd);
  if (path in dir) return "Directory already exists";
  dir[path] = {};
  return "Directory created: " + path;
}

function touch(filename, content = "") {
  if (!filename) return "Usage: touch <filename> [content]";
  let dir = getDir(cwd);
  if (filename in dir) return "File already exists";
  dir[filename] = content;
  return "File created: " + filename;
}

function rm(name) {
  if (!name) return "Usage: rm <file/directory>";
  let dir = getDir(cwd);
  if (!(name in dir)) return "No such file or directory";
  if (typeof dir[name] === "object" && Object.keys(dir[name]).length > 0) return "Directory not empty";
  delete dir[name];
  return "Removed: " + name;
}

function writeFile(filename, content) {
  if (!filename) return "Usage: write <filename> <content>";
  let dir = getDir(cwd);
  dir[filename] = content;
  return "File updated: " + filename;
}

function mv(oldName, newName) {
  if (!oldName || !newName) return "Usage: mv <source> <destination>";
  let dir = getDir(cwd);
  if (!(oldName in dir)) return "No such file or directory";
  dir[newName] = dir[oldName];
  delete dir[oldName];
  return "Moved: " + oldName + " -> " + newName;
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "c") {
    stopProcess();
    prompt();
  }
});

// Click anywhere to focus input
document.addEventListener("click", (e) => {
  if (e.target.closest("#music-player-bar")) return;
  const inputs = terminal.querySelectorAll("input");
  if (inputs.length > 0) {
    inputs[inputs.length - 1].focus();
  }
});

// Tab autocomplete
const autocompleteCommands = ["ls", "cd", "cat", "pwd", "clear", "help", "donut", "exit", "music", "musicplayer", "mkdir", "touch", "rm", "write", "mv"];
let tabCycleIndex = -1;
let tabCycleMatches = [];
let tabCycleOriginal = "";

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const inputs = terminal.querySelectorAll("input");
    if (inputs.length === 0) return;
    const input = inputs[inputs.length - 1];
    const value = input.value.trim();
    if (!value) return;
    const parts = value.split(" ");
    const lastPart = parts[parts.length - 1];
    if (lastPart !== tabCycleOriginal || tabCycleMatches.length === 0) {
      tabCycleIndex = -1;
      tabCycleOriginal = lastPart;
      tabCycleMatches = [];
      if (parts.length === 1) {
        const cmdMatch = autocompleteCommands.filter(c => c.startsWith(lastPart));
        let dir; try { dir = getDir(cwd); } catch(err) { dir = {}; }
        const fileMatch = Object.keys(dir).filter(f => f.startsWith(lastPart));
        tabCycleMatches = [...cmdMatch, ...fileMatch];
      } else {
        let dir; try { dir = getDir(cwd); } catch(err) { dir = {}; }
        tabCycleMatches = Object.keys(dir).filter(f => f.startsWith(lastPart));
      }
    }
    if (tabCycleMatches.length === 0) return;
    tabCycleIndex = (tabCycleIndex + 1) % tabCycleMatches.length;
    if (parts.length === 1) {
      input.value = tabCycleMatches[tabCycleIndex] + " ";
    } else {
      parts[parts.length - 1] = tabCycleMatches[tabCycleIndex];
      input.value = parts.join(" ") + " ";
    }
  }
});

document.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT" && e.target.closest("#terminal")) {
    tabCycleIndex = -1;
    tabCycleMatches = [];
    tabCycleOriginal = "";
  }
});

// ============ BANNER ============
function printBanner() {
  if (!document.getElementById("banner-glitch-style")) {
    const style = document.createElement("style");
    style.id = "banner-glitch-style";
    style.textContent = `
      .banner {
        display: inline-block;
        font-family: 'JetBrains Mono', monospace;
        white-space: pre;
        will-change: transform, filter, clip-path;
      }
      @keyframes banner-glitch-anim {
        0%   { transform: translate(0,0); filter: none; clip-path: inset(0 0 0 0); }
        6%   { transform: translate(-3px, 1px); filter: drop-shadow(3px 0 0 #ff2b6e) drop-shadow(-3px 0 0 #2bdcff); clip-path: inset(8% 0 55% 0); }
        12%  { transform: translate(2px, -2px); filter: drop-shadow(-2px 0 0 #ff2b6e) drop-shadow(2px 0 0 #2bdcff); clip-path: inset(45% 0 20% 0); }
        18%  { transform: translate(-4px, 0); filter: none; clip-path: inset(0 0 0 0); }
        24%  { transform: translate(3px, 2px); filter: drop-shadow(2px 0 0 #ff2b6e) drop-shadow(-2px 0 0 #2bdcff); clip-path: inset(65% 0 5% 0); }
        30%  { transform: translate(-1px, -1px); filter: drop-shadow(-3px 0 0 #ff2b6e) drop-shadow(3px 0 0 #2bdcff); clip-path: inset(15% 0 70% 0); }
        36%  { transform: translate(0,0); filter: none; clip-path: inset(0 0 0 0); }
        45%  { transform: translate(2px, 1px); filter: drop-shadow(2px 0 0 #ff2b6e) drop-shadow(-2px 0 0 #2bdcff); clip-path: inset(30% 0 40% 0); }
        52%  { transform: translate(-2px, 0); filter: none; clip-path: inset(0 0 0 0); }
        60%  { transform: translate(0,0); filter: none; clip-path: inset(0 0 0 0); }
        100% { transform: translate(0,0); filter: none; clip-path: inset(0 0 0 0); }
      }
      .banner.glitching { animation: banner-glitch-anim 650ms steps(1, end) 1; }
    `;
    document.head.appendChild(style);
  }

      print(`
          <div class="banner-container" style="display:flex; align-items:flex-start; justify-content:space-between; width:100%; position:sticky; top:0; z-index:5; background:#0d0d0d; padding-bottom:8px;">
            <span class="banner" id="amirmahdi-banner">
           <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span>   <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span>   <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span>  <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#3b82f6">█</span><span style="color:#3b82f6">█</span><span style="color:#f2f6ff">╗</span>
          <span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╗</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">║</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">║</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╗</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">║</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╗</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">║</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">╗</span><span style="color:#4f8df9">█</span><span style="color:#4f8df9">█</span><span style="color:#f2f6ff">║</span>
          <span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">╔</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">╔</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">╝</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">╔</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">╔</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span><span style="color:#60a5fa">█</span><span style="color:#60a5fa">█</span><span style="color:#f2f6ff">║</span>
          <span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f2f6ff">╚</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">╝</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">╗</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f2f6ff">╚</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">╝</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#7cb8ff">█</span><span style="color:#7cb8ff">█</span><span style="color:#f2f6ff">║</span>
          <span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span> <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span> <span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span> <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span> <span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">╝</span><span style="color:#9ac8ff">█</span><span style="color:#9ac8ff">█</span><span style="color:#f2f6ff">║</span>
          <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>  <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>     <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>  <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>     <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>  <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>  <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span> <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>

          <span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span>   <span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span>  <span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span>      <span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#b7d7ff">█</span><span style="color:#b7d7ff">█</span><span style="color:#f2f6ff">╗</span>
          <span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">╗</span> <span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">╗</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">╗</span>     <span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">╗</span><span style="color:#d0e4ff">█</span><span style="color:#d0e4ff">█</span><span style="color:#f2f6ff">║</span>
          <span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">║</span>   <span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">║</span>     <span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">╗</span>  <span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">╝</span><span style="color:#e6f0ff">█</span><span style="color:#e6f0ff">█</span><span style="color:#f2f6ff">║</span>
          <span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f2f6ff">╚</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">╝</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">║</span>   <span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span>   <span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>  <span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">╗</span><span style="color:#f0f7ff">█</span><span style="color:#f0f7ff">█</span><span style="color:#f2f6ff">║</span>
          <span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span> <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span> <span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f2f6ff">╚</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">╝</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span><span style="color:#f2f6ff">╚</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">╔</span><span style="color:#f2f6ff">╝</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">╗</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span>  <span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span><span style="color:#ffffff">█</span><span style="color:#ffffff">█</span><span style="color:#f2f6ff">║</span>
          <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>     <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span> <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span> <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>  <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>  <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span> <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span> <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>  <span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span><span style="color:#f2f6ff">╚</span><span style="color:#f2f6ff">═</span><span style="color:#f2f6ff">╝</span>
    </span>
          <img id="banner-animation" src="portrait.gif" style="width:120px; height:120px; border-radius:4px; object-fit:cover; flex-shrink:0;">
    </div>
    `);

  if (!window.__bannerGlitchStarted) {
    window.__bannerGlitchStarted = true;
    setInterval(() => {
      const el = document.getElementById("amirmahdi-banner");
      if (!el) return;
      el.classList.remove("glitching");
      void el.offsetWidth;
      el.classList.add("glitching");
    }, 20000);
  }
}

// ============ BOOT SEQUENCE ============
function bootSequence() {
  const bootMessages = [
    "[ OK ] BIOS - American Megatrends Inc. v2.15.1236",
    "[ OK ] CPU: Intel(R) Core(TM) i7-9750H @ 2.60GHz",
    "[ OK ] Memory: 16384MB RAM (16384MB usable)",
    "[ OK ] ACPI: PCI Interrupt Link [LNKA] (IRQs 3 4 5 6 7 9 10 11 12 14 15)",
    "[ OK ] ACPI: PCI Interrupt Link [LNKB] (IRQs 3 4 5 6 7 9 10 *11 12 14 15)",
    "[ OK ] ACPI: PCI Interrupt Link [LNKC] (IRQs 3 4 5 6 7 9 *10 11 12 14 15)",
    "[ OK ] ACPI: PCI Interrupt Link [LNKD] (IRQs 3 4 5 6 7 9 10 *11 12 14 15)",
    "[ OK ] PCI: Using ACPI for IRQ routing",
    "[ OK ] SCSI subsystem initialized",
    "[ OK ] usbcore: registered new interface driver usbfs",
    "[ OK ] usbcore: registered new interface driver hub",
    "[ OK ] usbcore: registered new device driver usb",
    "[ OK ] PCI: Probing PCI hardware",
    "[ OK ] BIOS settings: hdc:DMA, hdd:PIO",
    "[ OK ] RAMDISK: Compressed image found at block 0",
    "[ OK ] EXT4-fs (sda1): mounted filesystem with ordered data mode",
    "[ OK ] VFS: Mounted root (ext4 filesystem) readonly",
    "[ OK ] Freeing unused kernel memory: 256k freed",
    "[ OK ] INIT: version 2.88 booting",
    "[ OK ] Starting udev",
    "[ OK ] udevd[378]: starting version 175",
    "[ OK ] Setting hostname to 'amirmoha-terminal'",
    "[ OK ] Checking root file system...",
    "[ OK ] fsck from util-linux 2.20.1",
    "[ OK ] /dev/sda1: clean, 234567/12345678 files, 1234567/12345678 blocks",
    "[ OK ] Remounting root file system in read-write mode",
    "[ OK ] Activating swap...",
    "[ OK ] Cleaning up temporary files...",
    "[ OK ] Configuring network interfaces...",
    "[ OK ] Starting system logging daemon...",
    "[ OK ] Starting kernel log daemon...",
    "[ OK ] Starting OpenBSD Secure Shell server: sshd",
    "[ OK ] Starting NTP server: ntpd",
    "[ OK ] Starting periodic command scheduler: cron",
    "[ OK ] Running local boot scripts (/etc/rc.local)",
    "[ OK ] Loading terminal configuration...",
    "Welcome to AMIRMOHA Terminal OS v4.20",
    "Kernel 5.15.0-terminal-generic on an x86_64",
    "",
    "terminal login:"
  ];

  let index = 0;
  const bootInterval = setInterval(() => {
    if (index < bootMessages.length) {
      printBoot(bootMessages[index]);
      index++;
    } else {
      clearInterval(bootInterval);
      setTimeout(() => {
        document.querySelector('.crt-screen').classList.add('flash');
        setTimeout(() => {
          document.querySelector('.crt-screen').classList.remove('flash');
          bootScreen.style.display = 'none';
          terminal.style.display = 'block';
          printBanner();
          print("Type 'help' to see available commands.");
          prompt();
        }, 100);
      }, 500);
    }
  }, 50);
}

bootSequence();