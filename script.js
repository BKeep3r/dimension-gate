console.warn("Phase carries meaning. Symbols remember.");

/* ================== AUDIO ================== */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/* ================== STATE ================== */
const REAL_USER = "hubro2.0";
const REAL_PASS = "Wanted#123";
const state = { logged: false };

/* ================== LOGIN ================== */
function login() {
  if (user.value === REAL_USER && pass.value === REAL_PASS) {
    state.logged = true;
    loginBox.classList.add("hidden");
    challengeBox.classList.remove("hidden");
    matrixCanvas.classList.remove("hidden");
    startMatrix();
    runGate();
  } else {
    loginMsg.textContent = "REQUEST DENIED";
  }
}

/* ================== GATE ================== */
const gates = [{
  id: "signal",
  prompt: "Enter the word hidden in the stream.",
  validate: v => v.toLowerCase().includes("gate")
}];

function runGate() {
  gateTitle.textContent = gates[0].id;
  gatePrompt.textContent = gates[0].prompt;
}

submitBtn.onclick = () => {
  if (gates[0].validate(code.value)) {
    challengeBox.classList.add("hidden");
    dimension.classList.remove("hidden");
    dimension.classList.add("active");
    setTimeout(() => dimension.onclick(), 800);
  } else {
    challengeMsg.textContent = "❌ REJECTED";
  }
};

/* ================== MATRIX ================== */
const glyphs = "01ΔΞΩΛΣΦ";
let columns = [];
let attractors = [];

function startMatrix() {
  const c = matrixCanvas;
  const ctx = c.getContext("2d");
  c.width = innerWidth;
  c.height = innerHeight;

  const colCount = Math.floor(c.width / 16);
  columns = Array.from({ length: colCount }, (_, i) => ({
    x: i * 16,
    y: Math.random() * c.height,
    vy: 1 + Math.random() * 2,
    char: glyphs[Math.floor(Math.random() * glyphs.length)],
    influence: null
  }));

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = "16px monospace";

    columns.forEach(col => {
      let ax = 0, ay = col.vy;

      // Attractor influence
      attractors.forEach(a => {
        const dx = a.x - col.x;
        const dy = a.y - col.y;
        const dist = Math.sqrt(dx*dx + dy*dy) + 1;
        const force = a.strength / dist;

        ax += dx / dist * force;
        ay += dy / dist * force;

        if (dist < 20) col.char = a.char;
      });

      col.x += ax;
      col.y += ay;

      if (col.y > c.height) {
        col.y = 0;
        col.x = Math.floor(col.x / 16) * 16;
        col.char = glyphs[Math.floor(Math.random() * glyphs.length)];
      }

      ctx.fillStyle = "#0ff";
      ctx.fillText(col.char, col.x, col.y);
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ================== DIMENSION ================== */
dimension.onclick = () => {
  dimension.classList.remove("active");
  dimension.classList.add("hidden");
  showMeltingMessage();
};

/* ================== MELTING MESSAGE ================== */
function showMeltingMessage() {
  const msg = "THIS WAS ONLY THE FIRST LAYER";
  const m = message3d;
  const t = messageText;

  t.innerHTML = "";
  attractors = [];

  msg.split("").forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch;
    span.style.display = "inline-block";
    span.style.margin = "0 2px";
    span.style.transform = "translateZ(0)";
    span.style.animation = `melt 2.5s forwards`;
    span.style.animationDelay = `${i * 0.08}s`;
    t.appendChild(span);

    // Register attractor
    setTimeout(() => {
      const rect = span.getBoundingClientRect();
      attractors.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        char: ch,
        strength: 120
      });
    }, i * 80);

    // Remove attractor as letter melts
    setTimeout(() => {
      attractors.shift();
    }, 2000 + i * 80);
  });

  m.classList.remove("hidden");

  const totalTime = 2600 + msg.length * 80;
  setTimeout(() => {
    attractors = [];
    m.classList.add("hidden");
    startZoomquilt();
  }, totalTime);
}

/* ================== ZOOMQUILT ================== */
function startZoomquilt() {
  const z = zoomquiltStage;
  z.classList.remove("hidden");
  z.style.opacity = "1";
}
