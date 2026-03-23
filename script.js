/* script.js — AOS + Rellax only, vanilla CSS transitions */

AOS.init({ duration: 600, easing: "ease", once: false, offset: 0 });

/* DOM refs */
const panel1        = document.getElementById("panel1");
const panel2        = document.getElementById("panel2");
const panelBg1      = panel1.querySelector(".panel-bg");
const panelBg2      = panel2.querySelector(".panel-bg");
const doorHotspot   = document.getElementById("door-hotspot");
const doorWrapper   = document.getElementById("door-wrapper");
const doorImg       = document.getElementById("door-img");
const enterHint     = document.getElementById("enter-hint");
const famHotspot    = document.getElementById("fam-hotspot");
const noteHotspot   = document.getElementById("note-hotspot");
const to3Hotspot    = document.getElementById("to3-hotspot");
const to3Wrapper    = document.getElementById("to3-wrapper");
const to3Img        = document.getElementById("to3-img");
const backHint      = document.getElementById("back-hint");
const modal         = document.getElementById("modal");
const modalContent  = document.getElementById("modal-content");
const modalClose    = document.getElementById("modal-close");
const modalBG       = document.getElementById("modal-backdrop");
const dustModal     = document.getElementById("dust-modal");
const dustClose     = document.getElementById("dust-close");
const dustBG        = document.getElementById("dust-backdrop");
const dustCanvas    = document.getElementById("dust-canvas");
const dustWrapper   = document.getElementById("dust-wrapper");
const dustHint      = document.getElementById("dust-hint");
const famClear      = document.getElementById("fam-clear");
const zoomOverlay   = document.getElementById("zoom-overlay");
const fadeOverlay   = document.getElementById("fade-overlay");
const devControls   = document.getElementById("dev-controls");
const devControlsP1 = document.getElementById("dev-controls-p1");
const devOutputP1   = document.getElementById("dev-output-p1");
const devOutput     = document.getElementById("dev-output");

let isAnimating = false;
let doorUsed    = false;

// Return to panel 2 when coming back from panel 3
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('startAtPanel') === '2') {
    localStorage.removeItem('startAtPanel');
    panel1.classList.remove('active');
    panel2.classList.add('active');
    if (panelBg2.complete) {
      layoutPanel2();
    } else {
      panelBg2.addEventListener('load', layoutPanel2);
    }
  }
  document.documentElement.style.visibility = '';
});

/* HOTSPOT POSITIONING
   panel-bg uses object-fit:contain so the rendered image may have
   letterbox bars. Compute the actual image rect and place
   hotspots as percentages of that rect. */

function getImageRect(imgEl) {
  const iw = imgEl.naturalWidth  || imgEl.width;
  const ih = imgEl.naturalHeight || imgEl.height;
  const cw = imgEl.clientWidth;
  const ch = imgEl.clientHeight;
  const imgRatio   = iw / ih;
  const frameRatio = cw / ch;
  let rw, rh, rx, ry;
  if (imgRatio > frameRatio) {
    rw = cw;
    rh = cw / imgRatio;
    rx = 0;
    ry = (ch - rh) / 2;
  } else {
    rh = ch;
    rw = ch * imgRatio;
    rx = (cw - rw) / 2;
    ry = 0;
  }
  return { x: rx, y: ry, w: rw, h: rh };
}

function placeHotspot(el, imgEl, lPct, tPct, wPct, hPct) {
  const r = getImageRect(imgEl);
  el.style.left   = (r.x + r.w * lPct / 100) + "px";
  el.style.top    = (r.y + r.h * tPct / 100)  + "px";
  el.style.width  = (r.w * wPct / 100)         + "px";
  el.style.height = (r.h * hPct / 100)         + "px";
}

/* Stored positions, updated live by dev controls */
const positions = {
  door: { l: 54.3, t: 21.2, w: 12,   h: 73   },
  fam:  { l: 4.3,  t: 23.3, w: 12.4, h: 27.7 },
  note: { l: 93.9, t: 38.6, w: 4.6,  h: 10.8 },
  to3:  { l: 54.6, t: 36.8, w: 3.4,  h: 16.8 },
};

function layoutPanel1() {
  const p = positions.door;
  placeHotspot(doorHotspot, panelBg1, p.l, p.t, p.w, p.h);
}

function layoutPanel2() {
  placeHotspot(famHotspot,  panelBg2, positions.fam.l,  positions.fam.t,  positions.fam.w,  positions.fam.h);
  placeHotspot(noteHotspot, panelBg2, positions.note.l, positions.note.t, positions.note.w, positions.note.h);
  placeHotspot(to3Hotspot,  panelBg2, positions.to3.l,  positions.to3.t,  positions.to3.w,  positions.to3.h);
}

function layoutAll() {
  layoutPanel1();
  layoutPanel2();
}

window.addEventListener("resize", layoutAll);

let loaded = 0;
function onImgLoad() {
  loaded++;
  if (loaded >= 2) layoutAll();
}
if (panelBg1.complete) onImgLoad(); else panelBg1.addEventListener("load", onImgLoad);
if (panelBg2.complete) onImgLoad(); else panelBg2.addEventListener("load", onImgLoad);

/* PANEL SWITCH */
function switchPanel(to) {
  if (isAnimating) return;
  isAnimating = true;

  fadeOverlay.classList.add("active");
  setTimeout(() => {
    if (to === 2) {
      panel1.classList.remove("active");
      panel2.classList.add("active");
      layoutPanel2();
    } else {
      panel2.classList.remove("active");
      panel1.classList.add("active");
      resetDoor();
      layoutPanel1();
    }
    AOS.refreshHard();
    fadeOverlay.classList.remove("active");
    setTimeout(() => { isAnimating = false; }, 460);
  }, 460);
}

/* DOOR */
const doorCreak = new Audio("assets/audio/door_creak.mp3");

function resetDoor() {
  doorUsed = false;
  doorWrapper.classList.remove("open");
  enterHint.classList.remove("visible");
  enterHint.classList.add("hidden");
  window.removeEventListener("wheel",      onScrollEnter);
  window.removeEventListener("touchstart", onTouchStart);
}

doorHotspot.addEventListener("click", () => {
  if (doorUsed || isAnimating) return;
  doorUsed = true;

  doorCreak.currentTime = 0;
  doorCreak.play().catch(() => {});

  doorWrapper.classList.add("open");

  setTimeout(() => {
    enterHint.classList.remove("hidden");
    requestAnimationFrame(() => enterHint.classList.add("visible"));
    window.addEventListener("wheel",      onScrollEnter, { passive: true });
    window.addEventListener("touchstart", onTouchStart,  { passive: true });
  }, 680);
});

function onScrollEnter(e) {
  if (e.deltaY > 0) triggerZoomEnter();
}

let touchStartY = 0;
function onTouchStart(e) {
  touchStartY = e.touches[0].clientY;
  window.addEventListener("touchend", onTouchEnd, { passive: true });
}
function onTouchEnd(e) {
  window.removeEventListener("touchend", onTouchEnd);
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (dy > 40) triggerZoomEnter();
}

function triggerZoomEnter() {
  if (isAnimating) return;
  isAnimating = true;

  window.removeEventListener("wheel",      onScrollEnter);
  window.removeEventListener("touchstart", onTouchStart);

  enterHint.classList.remove("visible");

  const originX = (positions.door.l + positions.door.w * 0.3) + "%";
  const originY = (positions.door.t + positions.door.h * 0.35) + "%";

  panel1.style.transformOrigin = originX + " " + originY;
  panel1.style.transition      = "transform 0.9s ease-in, opacity 0.35s ease 0.6s";
  panel1.style.transform       = "scale(6)";
  panel1.style.opacity         = "0";

  setTimeout(() => {
    panel1.style.transition      = "none";
    panel1.style.transform       = "";
    panel1.style.opacity         = "";
    panel1.style.transformOrigin = "";

    panel1.classList.remove("active");
    panel2.classList.add("active");
    layoutPanel2();
    AOS.refreshHard();
    isAnimating = false;
  }, 1000);
}

/* BACK NAVIGATION */
backHint.addEventListener("click", () => switchPanel(1));

/* We use back button and not scroll
/* Scroll up on panel 2 goes back to panel 1
panel2.addEventListener("wheel", (e) => {
  if (e.deltaY < 0) switchPanel(1);
}, { passive: true }); */

/* MODALS */
function openModal(src) {
  modalContent.innerHTML = "";
  const img = new Image();
  img.src = src;
  img.alt = "detail view";
  modalContent.appendChild(img);
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
  setTimeout(() => {
    modalContent.innerHTML = "";
    document.getElementById("modal-box").classList.remove("panel3-iframe");
    to3Used = false;
    to3Wrapper.classList.remove("open");
  }, 350);
}
modalClose.addEventListener("click", closeModal);
modalBG.addEventListener("click", closeModal);

noteHotspot.addEventListener("click", () => openModal("assets/clue/note_hq.svg"));

let to3Used = false;
to3Hotspot.addEventListener("click", () => {
  if (to3Used) return;
  to3Used = true;

  to3Wrapper.classList.add("open");

  setTimeout(() => {
    window.location.href = "panel3/index.html";
  });
});

/* DUST SCRUB */
let dustReady   = false;
let dustCleared = false;
const THRESHOLD = 0.30;

const DUSTER_CURSOR = "url('assets/cursor/duster.png') 36 36, crosshair";

famHotspot.addEventListener("click", () => {
  dustModal.classList.add("open");
  dustWrapper.style.cursor = DUSTER_CURSOR;
  if (!dustReady) requestAnimationFrame(initDust);
});

function closeDustModal() { dustModal.classList.remove("open"); }
dustClose.addEventListener("click", closeDustModal);
dustBG.addEventListener("click", closeDustModal);

function initDust() {
  dustReady = true;
  const rect = famClear.getBoundingClientRect();
  const W = Math.round(rect.width)  || 600;
  const H = Math.round(rect.height) || 460;
  dustCanvas.width  = W;
  dustCanvas.height = H;
  const ctx = dustCanvas.getContext("2d");
  drawDust(ctx, W, H);

  dustCanvas.style.cursor = DUSTER_CURSOR;

  const brushR = Math.max(66, W * 0.13);
  let erasing = false;
  let autoCleanTriggered = false;

  function pos(e) {
    const r = dustCanvas.getBoundingClientRect();
    const s = e.touches ? e.touches[0] : e;
    return { x: (s.clientX - r.left) * (W / r.width), y: (s.clientY - r.top) * (H / r.height) };
  }

  function eraseAt(x, y, radius) {
    ctx.globalCompositeOperation = "destination-out";
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0,    "rgba(0,0,0,1)");
    g.addColorStop(0.4,  "rgba(0,0,0,0.92)");
    g.addColorStop(0.75, "rgba(0,0,0,0.55)");
    g.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  function erase(e) {
    if (!erasing) return;
    const { x, y } = pos(e);
    eraseAt(x, y, brushR);
    checkReveal(ctx, W, H, eraseAt, autoCleanTriggered, () => {
      autoCleanTriggered = true;
    });
  }

  dustCanvas.addEventListener("pointerdown", e => { erasing = true; erase(e); });
  dustCanvas.addEventListener("pointermove", erase);
  dustCanvas.addEventListener("pointerup",   () => { erasing = false; });
  dustCanvas.addEventListener("pointerleave",() => { erasing = false; });
}

function drawDust(ctx, W, H) {
  ctx.fillStyle = "rgba(85,74,54,0.9)";
  ctx.fillRect(0, 0, W, H);

  const iData = ctx.getImageData(0, 0, W, H);
  const d = iData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 38;
    d[i]   = Math.min(255, Math.max(0, d[i]   + n));
    d[i+1] = Math.min(255, Math.max(0, d[i+1] + n * 0.75));
    d[i+2] = Math.min(255, Math.max(0, d[i+2] + n * 0.45));
  }
  ctx.putImageData(iData, 0, 0);

  ctx.save();
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 16; i++) {
    const x1 = Math.random() * W, y1 = Math.random() * H;
    const x2 = x1 + (Math.random() - 0.5) * W * 0.55;
    const y2 = y1 + (Math.random() - 0.5) * H * 0.15;
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0,    "rgba(45,36,22,0)");
    g.addColorStop(0.45, "rgba(45,36,22,0.55)");
    g.addColorStop(1,    "rgba(45,36,22,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = Math.random() * 10 + 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H * 0.3;
    const r = Math.random() * 22 + 7;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(65,52,34,0.65)");
    g.addColorStop(1, "rgba(65,52,34,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 2.2, r * 0.55, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function checkReveal(ctx, W, H, eraseAt, autoCleanTriggered, onTrigger) {
  if (dustCleared) return;
  const step = 8;
  const data = ctx.getImageData(0, 0, W, H).data;
  let cleared = 0, total = 0;
  for (let i = 3; i < data.length; i += 4 * step) {
    total++;
    if (data[i] < 28) cleared++;
  }
  const pct = cleared / total;

  dustHint.textContent = pct < 0.15 ? "Wipe the dust away…"
                       : pct < 0.25 ? "Keep going…"
                       : pct < 0.30 ? "Almost there…"
                       : "";

  if (pct >= 0.30 && !autoCleanTriggered) {
    onTrigger();
    dustCanvas.style.pointerEvents = "none";
    autoSweep(ctx, W, H, eraseAt);
  }
}

function autoSweep(ctx, W, H, eraseAt) {
  const sweepR  = Math.max(80, W * 0.14);
  const strokes = [];
  const rows    = 8;

  for (let r = 0; r < rows; r++) {
    const yBase   = (H / rows) * r + H / (rows * 2);
    const goRight = r % 2 === 0;
    const x0  = goRight ? -sweepR : W + sweepR;
    const x1  = goRight ? W * 0.45 + (Math.random() - 0.5) * W * 0.1
                        : W * 0.55 + (Math.random() - 0.5) * W * 0.1;
    const x2  = goRight ? W + sweepR : -sweepR;
    const cy1 = yBase + (Math.random() - 0.5) * (H / rows) * 0.6;
    const cy2 = yBase + (Math.random() - 0.5) * (H / rows) * 0.6;

    const pts  = [];
    const steps = 55;
    for (let t = 0; t <= 1; t += 1 / steps) {
      const mt = 1 - t;
      const x  = mt*mt*mt*x0 + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t*t*t*(goRight ? W + sweepR : -sweepR);
      const y  = mt*mt*cy1 + 2*mt*t*yBase + t*t*cy2 + (Math.random() - 0.5) * 6;
      pts.push({ x, y });
    }
    strokes.push(pts);
  }

  let strokeIdx = 0;
  let ptIdx     = 0;

  const sweepInterval = setInterval(() => {
    if (strokeIdx >= strokes.length) {
      clearInterval(sweepInterval);
      setTimeout(() => revealPortrait(), 200);
      return;
    }

    const pts = strokes[strokeIdx];
    for (let b = 0; b < 3 && ptIdx < pts.length; b++, ptIdx++) {
      const { x, y } = pts[ptIdx];
      eraseAt(x, y, sweepR * (0.85 + Math.random() * 0.3));
    }

    if (ptIdx >= pts.length) {
      strokeIdx++;
      ptIdx = 0;
    }
  }, 10);
}

function revealPortrait() {
  dustCleared = true;
  dustCanvas.style.transition    = "opacity 1.4s ease";
  dustCanvas.style.opacity       = "0";
  dustCanvas.style.pointerEvents = "none";
  setTimeout(() => {
    dustWrapper.classList.add("revealed");
    dustHint.textContent = "✦ memory restored ✦";
    dustHint.style.color = "rgba(255,228,155,0.95)";
  }, 1000);
}

/* DEV CONTROLS — panel 2 hotspot positioning */
const keyMap = {
  "fam-hotspot":  positions.fam,
  "note-hotspot": positions.note,
  "to3-hotspot":  positions.to3,
};

function updateDevOutput() {
  devOutput.textContent =
    `fam:  left:${positions.fam.l}% top:${positions.fam.t}% w:${positions.fam.w}% h:${positions.fam.h}%\n` +
    `note: left:${positions.note.l}% top:${positions.note.t}% w:${positions.note.w}% h:${positions.note.h}%\n` +
    `to3:  left:${positions.to3.l}% top:${positions.to3.t}% w:${positions.to3.w}% h:${positions.to3.h}%`;
}

devControls.querySelectorAll("input[type=range]").forEach(slider => {
  slider.addEventListener("input", () => {
    const target = slider.dataset.target;
    const prop   = slider.dataset.prop;
    const val    = parseFloat(slider.value);
    const pos    = keyMap[target];
    if (prop === "left")   pos.l = val;
    if (prop === "top")    pos.t = val;
    if (prop === "width")  pos.w = val;
    if (prop === "height") pos.h = val;
    slider.nextElementSibling.textContent = val + "%";
    layoutPanel2();
    updateDevOutput();
  });
});

/* DEV CONTROLS — panel 1 door positioning */
function updateDevOutputP1() {
  devOutputP1.textContent =
    `door: left:${positions.door.l}% top:${positions.door.t}% w:${positions.door.w}% h:${positions.door.h}%`;
}

devControlsP1.querySelectorAll("input[type=range]").forEach(slider => {
  slider.addEventListener("input", () => {
    const prop = slider.dataset.prop;
    const val  = parseFloat(slider.value);
    if (prop === "left")   positions.door.l = val;
    if (prop === "top")    positions.door.t = val;
    if (prop === "width")  positions.door.w = val;
    if (prop === "height") positions.door.h = val;
    slider.nextElementSibling.textContent = val + "%";
    layoutPanel1();
    updateDevOutputP1();
  });
});

/* Press 1 for panel 1 dev controls, 2 for panel 2 */
document.addEventListener("keydown", e => {
  if (e.key === "1") {
    devControlsP1.classList.toggle("hidden");
    if (!devControlsP1.classList.contains("hidden")) updateDevOutputP1();
    return;
  }
  if (e.key === "2") {
    devControls.classList.toggle("hidden");
    if (!devControls.classList.contains("hidden")) updateDevOutput();
    return;
  }
  if (e.key === "Escape") {
    if (dustModal.classList.contains("open"))  closeDustModal();
    else if (modal.classList.contains("open")) closeModal();
  }
});

/* ENTRANCE */
window.addEventListener("load", () => {
  panel1.style.transition = "opacity 1.2s ease";
  panel1.style.opacity    = "0";
  requestAnimationFrame(() => requestAnimationFrame(() => {
    panel1.style.opacity = "1";
  }));
});
