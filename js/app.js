// ── PAGE NAVIGATION ──
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    pages[index].classList.add('active');
  });
});

// ── SET LOGGER ──
const exerciseRows = document.querySelectorAll('.exercise-row');
let currentRow = null;
let restTimer = null;

exerciseRows.forEach(row => {
  row.addEventListener('click', (e) => {
    // dont trigger if clicking a button or input inside the row
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

    const exerciseLogger = row.querySelector('.exercise-logger');

    // if already open, close it
    if (exerciseLogger.classList.contains('open')) {
      exerciseLogger.classList.remove('open');
      exerciseLogger.innerHTML = '';
      return;
    }

    // close any other open loggers
    document.querySelectorAll('.exercise-logger.open').forEach(el => {
      el.classList.remove('open');
      el.innerHTML = '';
    });

    const meta = row.querySelector('.exercise-meta').textContent;
    const numSets = parseInt(meta.match(/(\d+) sets/)[1]);
    currentRow = row;

    let setsHTML = '';
    for (let i = 1; i <= numSets; i++) {
      setsHTML += `
        <div class="set-row" id="set-row-${i}">
          <span class="set-num">${i}</span>
          <input type="number" placeholder="reps" class="set-input">
          <input type="number" placeholder="lbs" class="set-input">
          <button class="set-complete-btn" onclick="completeSet(${i}, ${numSets})">Complete</button>
        </div>
      `;
    }

    exerciseLogger.innerHTML = setsHTML;
    exerciseLogger.classList.add('open');
  });
});

// ── COMPLETE SET ──
function completeSet(setNum, totalSets) {
  const currentSet = document.getElementById(`set-row-${setNum}`);
  currentSet.style.borderLeft = '3px solid #2ed573';
  currentSet.style.background = 'rgba(46, 213, 115, 0.1)';
  currentSet.style.borderRadius = '8px';
  currentSet.querySelector('.set-complete-btn').disabled = true;
  currentSet.querySelector('.set-complete-btn').textContent = '✓';

  if (setNum === totalSets) {
    setTimeout(() => {
      currentRow.classList.add('completed');
      currentRow.querySelector('.exercise-status').textContent = '✓';
      currentRow.querySelector('.exercise-logger').classList.remove('open');
      currentRow.querySelector('.exercise-logger').innerHTML = '';

      const allDone = document.querySelectorAll('.exercise-row.completed').length === exerciseRows.length;
      if (allDone) {
        document.getElementById('checkin').style.display = 'block';
      }
    }, 1000);
    return;
  }

  let timeLeft = 5;

  //clear old timer first
  clearInterval(restTimer);
  document.querySelectorAll('.rest-timer').forEach(el =>el.remove());

  //create new timer display
  setTimeout(() => {
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'rest-timer';
    timerDisplay.textContent = `Rest: ${timeLeft}s`;
    currentSet.appendChild(timerDisplay);

    restTimer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Rest: ${timeLeft}s`;
      if (timeLeft === 0) {
        clearInterval(restTimer);
        timerDisplay.textContent = 'Go!';
        setTimeout(() => timerDisplay.remove(), 1000);
      }
    }, 1000);
  }, 100);
}

// ── POST WORKOUT CHECK IN ──
let selectedRPE = null;
let selectedSoreness = null;

function selectRPE(btn) {
  document.querySelectorAll('#rpe-options .checkin-btn').forEach(b => {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
  selectedRPE = btn.textContent;
}

function selectSoreness(btn) {
  document.querySelectorAll('.checkin-section:last-of-type .checkin-btn').forEach(b => {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
  selectedSoreness = btn.textContent;
}

function submitCheckin() {
  if (!selectedRPE || !selectedSoreness) {
    alert('Please rate your effort and soreness before saving!');
    return;
  }
  alert(`Workout saved! RPE: ${selectedRPE}, Soreness: ${selectedSoreness}`);
  document.getElementById('checkin').style.display = 'none';
}