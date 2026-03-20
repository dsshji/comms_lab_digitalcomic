// IMAGE
const img = new Image();
img.src = 'stairs.png';


// CANVAS
const canvas = document.getElementById('stair-canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);


// AUDIO
const stairsSound = new Audio('audios/stairs.mp3');
stairsSound.loop   = true;
stairsSound.volume = 0.6;

const beepSound = new Audio('audios/beep.mp3');
beepSound.volume = 0.2;
const doorSound = new Audio('audios/door_open.mp3');


// SCROLL
const scroller    = document.getElementById('stair-scroll');
let   progress    = 0;
let   doorVisible = false;

let stairsSoundPlaying = false;
let stairsSoundTimeout = null;

scroller.addEventListener('scroll', () => {
  const max = scroller.scrollHeight - scroller.clientHeight;
  progress  = max > 0 ? scroller.scrollTop / max : 0;

  // play stairs sound while scrolling
  if (!stairsSoundPlaying) {
    stairsSound.play().catch(() => {});
    stairsSoundPlaying = true;
  }

  // fade out shortly after scrolling stops
  clearTimeout(stairsSoundTimeout);
  stairsSoundTimeout = setTimeout(() => {
    fadeOutAudio(stairsSound, 600, () => {
      stairsSound.pause();
      stairsSound.currentTime = 0;
      stairsSoundPlaying = false;
    });
  }, 300);

  if (progress > 0.9 && !doorVisible) showDoor();
});

function fadeOutAudio(audio, duration, onDone) {
  const startVol   = audio.volume;
  const steps      = 20;
  const interval   = duration / steps;
  const decrement  = startVol / steps;

  const fade = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - decrement);
    if (audio.volume <= 0) {
      clearInterval(fade);
      audio.volume = startVol;
      if (onDone) onDone();
    }
  }, interval);
}


// DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (img.complete) {
    const ratio = img.naturalHeight / img.naturalWidth;
    const w     = canvas.width;
    const h     = w * ratio;

    const yStart = canvas.height * 0.3;
    const yEnd   = canvas.height - h;
    const y      = yStart + (yEnd - yStart) * progress;

    ctx.drawImage(img, 0, y, w, h);
  }

  requestAnimationFrame(draw);
}
draw();


// DOOR
const doorScene = document.getElementById('door-scene');

function showDoor() {
  doorVisible = true;
  doorScene.classList.add('visible');
}


// LOCK
const lock = document.getElementById('lock-hotspot');
lock.addEventListener('click', openModal);


// MODAL
const modal   = document.getElementById('code-modal');
const inputs  = document.querySelectorAll('.cm-digit');
const message = document.getElementById('cm-msg');

function openModal() {
  modal.classList.add('open');
  clearInputs();
  message.className = 'cm-message';
  inputs[0].focus();
}

function closeModal() {
  modal.classList.remove('open');
}

document.getElementById('cm-close').onclick    = closeModal;
document.getElementById('cm-backdrop').onclick = closeModal;

// auto-advance between digit inputs + beep on each entry
inputs.forEach((input, i) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value) {
      beepSound.currentTime = 0;
      beepSound.play().catch(() => {});
      if (i < inputs.length - 1) inputs[i + 1].focus();
    }
  });
});


// CHECK CODE
const CORRECT_CODE = '200920';

document.getElementById('cm-submit').addEventListener('click', checkCode);

function checkCode() {
  let code = '';
  inputs.forEach(input => code += input.value);

  if (code === CORRECT_CODE) {
    message.textContent = 'Correct.';
    message.className   = 'cm-message show-right';
    setTimeout(unlock, 600);
    return;
  }

  // wrong code
  message.textContent = 'Search the room again.';
  message.className   = 'cm-message show-wrong';

  inputs.forEach(input => {
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 350);
  });

  setTimeout(() => {
    clearInputs();
    inputs[0].focus();
  }, 400);
}

function clearInputs() {
  inputs.forEach(i => i.value = '');
}


// UNLOCK → FADE
function unlock() {
  closeModal();

  doorSound.currentTime = 0;
  doorSound.play().catch(() => {});

  setTimeout(() => {
    window.top.location.href = 'panel4/index.html'; //ADD PANEL 4 HERE
  }, 800);
}
