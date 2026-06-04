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