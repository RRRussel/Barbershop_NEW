var navMain = document.querySelector('.main-nav');
		var navToogle = document.querySelector('.main-nav__toogle');

		navMain.classList.remove('.main-nav--nojs');

		navToogle.addEventListener('click', function() {
				if (navMain.classList.contains('main-nav--closed')) {
					navMain.classList.remove('main-nav--closed');
					navMain.classList.add('main-nav--opened');
				} else {
					navMain.classList.add('main-nav--closed');
					navMain.classList.remove('main-nav--opened');
				}
		});
		