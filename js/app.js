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


// ── WORKOUT DATA ──
let currentWorkout = {
  name: 'Upper Body Hypertrophy',
  meta: '~55 min · 7 exercises · Intermediate',
  exercises: [
    { name: 'Bench Press', muscle: 'Chest', sets: 4 },
    { name: 'Incline Dumbbell Bench Press', muscle: 'Chest', sets: 4 },
    { name: 'Pull Ups', muscle: 'Back', sets: 4 },
    { name: 'Cable Flys', muscle: 'Chest', sets: 4 },
    { name: 'Seated Cable Rows', muscle: 'Back', sets: 4 },
    { name: 'Overhead Press', muscle: 'Shoulders', sets: 4 },
    { name: 'Lateral Raises', muscle: 'Shoulders', sets: 4 },
  ]
};

// ── BUILD EXERCISE LIST ──
function buildExerciseList() {
  const exerciseList = document.getElementById('exercise-list');

   exerciseList.innerHTML = currentWorkout.exercises.map((ex, i) => `
    <div class="exercise-row" data-exercise="${ex.name.toLowerCase().replace(/\s+/g, '-')}">
      <div class="exercise-header">
        <div class="exercise-info">
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-meta">${ex.muscle} · ${ex.sets} sets</div>
        </div>
        <div class="exercise-status">○</div>
      </div>
      <div class="exercise-logger"></div>
    </div>
  `).join('');

   const workoutName = document.getElementById('workout-name');
  const workoutMeta = document.getElementById('workout-meta');
  if (workoutName) workoutName.textContent = currentWorkout.name;
  if (workoutMeta) workoutMeta.textContent = currentWorkout.meta;

     // re-attach event listeners
    attachExerciseListeners();

} 



// ── SET LOGGER ──
const exerciseRows = document.querySelectorAll('.exercise-row');
let currentRow = null;
let restTimer = null;
const exerciseState = {};

// ── ATTACH EXERCISE LISTENERS ──
function attachExerciseListeners() {
  const rows = document.querySelectorAll('.exercise-row');

  rows.forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

      const exerciseLogger = row.querySelector('.exercise-logger');
      const exerciseId = row.dataset.exercise;

      if (exerciseLogger.classList.contains('open')) {
        exerciseLogger.classList.remove('open');
        exerciseLogger.innerHTML = '';
        return;
      }

      document.querySelectorAll('.exercise-logger.open').forEach(el => {
        el.classList.remove('open');
        el.innerHTML = '';
      });

      const meta = row.querySelector('.exercise-meta').textContent;
      const numSets = parseInt(meta.match(/(\d+) sets/)[1]);
      currentRow = row;

      if (!exerciseState[exerciseId]) {
        exerciseState[exerciseId] = [];
        for (let i = 1; i <= numSets; i++) {
          exerciseState[exerciseId].push({ reps: '', lbs: '', done: false });
        }
      }

      const state = exerciseState[exerciseId];

      let setsHTML = '';
      for (let i = 1; i <= numSets; i++) {
        const s = state[i - 1];
        const doneStyle = s.done ? 'border-left: 3px solid #2ed573; background: rgba(46,213,115,0.1); border-radius: 8px;' : '';
        setsHTML += `
          <div class="set-row" id="set-row-${i}" style="${doneStyle}">
            <span class="set-num">${i}</span>
            <input type="number" placeholder="reps" class="set-input" value="${s.reps}"
              oninput="saveInput('${exerciseId}', ${i-1}, 'reps', this.value)">
            <input type="number" placeholder="lbs" class="set-input" value="${s.lbs}"
              oninput="saveInput('${exerciseId}', ${i-1}, 'lbs', this.value)">
            <button class="set-complete-btn" onclick="completeSet(${i}, ${numSets}, '${exerciseId}')"
              ${s.done ? 'disabled' : ''}>
              ${s.done ? '✓' : 'Complete'}
            </button>
          </div>
        `;
      }

      exerciseLogger.innerHTML = setsHTML;
      exerciseLogger.classList.add('open');
    });
  });
}

// ── SAVE INPUT STATE ──
function saveInput(exerciseId, index, field, value) {
  if (exerciseState[exerciseId]) {
    exerciseState[exerciseId][index][field] = value;
  }
}

// ── COMPLETE SET ──
function completeSet(setNum, totalSets, exerciseId) {
  const currentSet = document.getElementById(`set-row-${setNum}`);
  currentSet.style.borderLeft = '3px solid #2ed573';
  currentSet.style.background = 'rgba(46, 213, 115, 0.1)';
  currentSet.style.borderRadius = '8px';
  currentSet.querySelector('.set-complete-btn').disabled = true;
  currentSet.querySelector('.set-complete-btn').textContent = '✓';

  // save done state
  exerciseState[exerciseId][setNum - 1].done = true;

  if (setNum === totalSets) {
    clearInterval(restTimer);
    document.querySelectorAll('.rest-timer').forEach(el => el.remove());
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
  clearInterval(restTimer);
  document.querySelectorAll('.rest-timer').forEach(el => el.remove());

  setTimeout(() => {
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'rest-timer';
    timerDisplay.textContent = `Rest: ${timeLeft}s`;
    const completeBtn = currentSet.querySelector('.set-complete-btn');
    completeBtn.insertAdjacentElement('afterend', timerDisplay);

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


// ── GENERATE WORKOUT ──
function generateWorkout() {
  const insightText = document.getElementById('ai-insight-text');
  const generateBtn = document.querySelector('.btn-generate');

  generateBtn.textContent = 'Generating...';
  generateBtn.disabled = true;
  insightText.textContent = 'Analyzing your recovery data...';

  setTimeout(() => {
    const insights = [
      "Your chest and back are fully recovered so I've prioritized pushing and pulling movements today. Your legs are still fatigued so I've kept this an upper body day.",
      "Based on your last session's RPE of 8, I've slightly reduced volume today to allow for quality over quantity. Focus on form and mind-muscle connection.",
      "Your shoulder recovery is at 55% so I've swapped heavy overhead pressing for lighter lateral raises. Great day to focus on chest and back.",
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    insightText.textContent = randomInsight;
    generateBtn.textContent = 'Regenerate Workout';
    generateBtn.disabled = false;
  }, 2000);
}


// ── INIT ──
buildExerciseList();