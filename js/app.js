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

exerciseRows.forEach(row =>{
    row.addEventListener('click', () => {
        const exerciseName = row.querySelector('.exercise-name').textContent;
        const meta = row.querySelector('.exercise-meta').textContent;
        const numSets = parseInt(meta.match(/(\d+) sets/)[1]);

        loggerTitle.textContent = exerciseName;

        // clear old sets
        loggerSets.innerHTML = '';

        // build new set rows
        for (let i = 1; i <= numSets; i++) {
            loggerSets.innerHTML += `
            <div class="set-row">
                <span class="set-num">${i}</span>
                <input type="number" placeholder="lbs" class="set-input">
                <span class="set-x">×</span>
                <input type="number" placeholder="reps" class="set-input">
            </div>
            `;
        }

        setLogger.classList.add('open');
    });
});

closeLoggerBtn.addEventListener('click', () => {
    setLogger.classList.remove('open');
});