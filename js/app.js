// -- PAGE NAVIGATION --
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {

        // Remove active class from all buttons
        navBtns.forEach(b => b.classList.remove('active'));

        //Remove active from all pages
        pages.forEach(p => p.classList.remove('active'));

        // set click button as active
        btn.classList.add('active');

        //show matching page
        pages[index].classList.add('active');

    });

});

// ── SET LOGGER ──
const exerciseRows = document.querySelectorAll('.exercise-row');
const setLogger = document.getElementById('set-logger');
const loggerTitle = document.getElementById('logger-title');
const closeLoggerBtn = document.getElementById('close-logger');
const loggerSets = document.getElementById('logger-sets');
let currentRow = null;
//let restTimer = null;

exerciseRows.forEach(row =>{
    row.addEventListener('click', () => {
        const exerciseName = row.querySelector('.exercise-name').textContent;
        const meta = row.querySelector('.exercise-meta').textContent;
        const numSets = parseInt(meta.match(/(\d+) sets/)[1]);
        currentRow = row;

        loggerTitle.textContent = exerciseName;

        // clear old sets
        loggerSets.innerHTML = '';

        // build new set rows
        for (let i = 1; i <= numSets; i++) {
            loggerSets.innerHTML += `
                <div class="set-row" id="set-row-${i}">
                    <span class="set-num">${i}</span>
                    <input type="number" placeholder="reps" class="set-input">
                    <input type="number" placeholder="lbs" class="set-input">
                    <button class="set-complete-btn" onclick="completeSet(${i}, ${numSets})">Complete</button>
                </div>
            `;
        }

        setLogger.classList.add('open');
    });
});

closeLoggerBtn.addEventListener('click', () => {
  const inputs = loggerSets.querySelectorAll('.set-input');
  let allFilled = true;

  inputs.forEach(input => {
    if (input.value === '') {
      allFilled = false;
    }
  });

  if (!allFilled) {
    alert('Please fill in all sets before completing!');
    return;
  }

  setLogger.classList.remove('open');
  currentRow.classList.add('completed');
  currentRow.querySelector('.exercise-status').textContent = '✓';
});

// --COMPLETE SET --
let restTimer = null;

function completeSet(setNum, totalSets) {
    //highlight current set green
    const currentSet = document.getElementById(`set-row-${setNum}`);
    currentSet.style.borderLeft = '3px solid #2ed573';
    currentSet.style.background = 'rgba(46, 213, 115, 0.1)';
    currentSet.style.borderRadius = '8px';
    currentSet.querySelector('.set-complete-btn').disabled = true;
    currentSet.querySelector('.set-complete-btn').textContent = '✓';

    //if all sets done, mark exercise complete
    if (setNum == totalSets) {
        setTimeout(() => {
            setLogger.classList.remove('open');
            currentRow.classList.add('completed');
            currentRow.querySelector('.exercise-status').textContent = '✓';
        }, 1000);
        return;
    }

    //start rest timer before next set
    let timeLeft = 5;
    const nextSet = document.getElementById(`set-row-${setNum + 1}`);
    nextSet.style.opacity = '1';

    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'rest-timer';
    timerDisplay.textContent = `Rest: ${timeLeft}s`;
    currentSet.appendChild(timerDisplay);

    restTimer = setInterval (() => {
        timeLeft--;
        timerDisplay.textContent = `Rest: ${timeLeft}s`;

        if (timeLeft == 0) {
            clearInterval(restTimer);
            timerDisplay.textContent = 'Go!';
            setTimeout(() => timerDisplay.remove(), 1000);
        }
    }, 1000)
}