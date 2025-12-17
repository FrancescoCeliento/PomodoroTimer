let mode = 'single';
let interval = null;
let timeLeft = 0;

let sequence = [];
let seqIndex = 0;
let currentLabel = 'Pronto';

let totalSteps = 0;
let currentStep = 0;

const timerEl = document.getElementById('timer');
const statusEl = document.getElementById('status');

function setMode(m) {
  mode = m;
  document.getElementById('single').style.display = m === 'single' ? 'block' : 'none';
  document.getElementById('pomodoro').style.display = m === 'pomodoro' ? 'block' : 'none';
  reset();
}

function setSingle(minutes) {
  timeLeft = minutes * 60;
  currentLabel = 'Countdown';
  update();
}

function start() {
  if (interval) return;

  if (mode === 'single' && timeLeft === 0) {
    const custom = document.getElementById('customMinutes').value;
    if (custom) setSingle(custom);
  }

  if (mode === 'pomodoro' && sequence.length === 0) {
    buildSequence();
  }

  interval = setInterval(tick, 1000);
}

function buildSequence() {
  sequence = [];
  seqIndex = 0;

  const work = +document.getElementById('work').value;
  const shortB = +document.getElementById('short').value;
  const longB = +document.getElementById('long').value;
  const steps = +document.getElementById('steps').value;

  totalSteps = steps;
  currentStep = 1;

  for (let i = 0; i < steps; i++) {
    sequence.push({ label: 'Work', time: work * 60, step: i + 1 });
    if (i < steps - 1) {
      sequence.push({ label: 'Short Break', time: shortB * 60, step: i + 1 });
    }
  }

  sequence.push({ label: 'Long Break', time: longB * 60, step: steps });
  loadStep();
}


function loadStep() {
  const step = sequence[seqIndex];
  timeLeft = step.time;
  currentLabel = step.label;
  currentStep = step.step;
}


function tick() {
  if (timeLeft <= 0) {
    if (mode === 'pomodoro' && seqIndex < sequence.length - 1) {
      seqIndex++;
      loadStep();
    } else {
      stop();
      return;
    }
  }

  timeLeft--;
  update();
}

function stop() {
  clearInterval(interval);
  interval = null;
}

function reset() {
  stop();
  timeLeft = 0;
  sequence = [];
  seqIndex = 0;
  currentLabel = 'Pronto';
  update();
}

function update() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerEl.textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  statusEl.textContent = currentLabel;

  if (timeLeft > 0) {
    if (mode === 'pomodoro') {
      document.title =
        `${currentLabel} (${currentStep}/${totalSteps}): ${Math.ceil(timeLeft / 60)}`;
    } else {
      document.title =
        `${currentLabel}: ${Math.ceil(timeLeft / 60)}`;
    }
  } else {
    document.title = 'Pomodoro';
  }
}


