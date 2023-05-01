'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

/* Page */
const page = {
	menu: document.querySelector('.menu__list'),
	header: {
		h1: document.querySelector('.h1'),
		progressPercent: document.querySelector('.progress__percent'),
		progressCoverBar: document.querySelector('.progress__cover-bar')
	},
	content: {
		habbitsList: document.querySelector('.habbit__list'),
		habbitFormNextDay: document.querySelector('.habbit__day_form-next-day')
	}
};

/* Utils */

function loadData() {
	const habbitsString = localStorage.getItem(HABBIT_KEY);
	const habbitsArray = JSON.parse(habbitsString);

	if (Array.isArray(habbitsArray)) {
		habbits = habbitsArray;
	}
}

function saveData() {
	localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* Render */

function rerenderMenu(activeHabbit) {
	for (const habbit of habbits) {
		const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);

		if (!existed) {
			const element = document.createElement('button');
			element.setAttribute('menu-habbit-id', habbit.id);
			element.classList.add('menu__item');
			element.addEventListener('click', () => rerender(habbit.id));
			element.innerHTML = `<img src="/img/${habbit.icon}.svg" alt="${habbit.name}"/>`;

			if (activeHabbit.id === habbit.id) {
				element.classList.add('menu__item_active');
			}

			page.menu.appendChild(element);

			continue;
		}

		if (activeHabbit.id === habbit.id) {
			existed.classList.add('menu__item_active');
		} else {
			existed.classList.remove('menu__item_active');
		}
	}
}

function rerenderHeader(activeHabbit)
{
	page.header.h1.innerText = activeHabbit.name;

	const percentValue = activeHabbit.days.length / activeHabbit.target;

	const percent = percentValue > 1
	? 100 
	: (percentValue * 100).toFixed(0);

	page.header.progressPercent.innerText = `${percent}%`;

	page.header.progressCoverBar.setAttribute('style', `width: ${percent}%`);
}

function rerenderContent(activeHabbit) {
	let contentHtml = '';

	let currentDay = 0

	activeHabbit.days.forEach((day) => {
		currentDay++;
		contentHtml += `
			<div class="habbit">
				<div class="habbit__day">День ${currentDay}</div>
				<div class="habbit__comment">${day.comment}</div>
				<button class="habbit__delete">
					<img src="/img/delete.svg" alt="Удалить день ${currentDay}">
				</button>						
			</div>
		`;
	});

	const nextDay = ++currentDay;

	page.content.habbitsList.innerHTML = contentHtml;
	page.content.habbitFormNextDay.innerText = `День ${nextDay}`;
}

function rerender(activeHabbitId) {
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);

	if (!activeHabbit) {
		return;
	}

	rerenderMenu(activeHabbit);
	rerenderHeader(activeHabbit);
	rerenderContent(activeHabbit);
}

(() => {
	loadData();
	rerender(habbits[0].id);
})();
