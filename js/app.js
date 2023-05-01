'use strict';

const HABBIT_KEY = 'HABBIT_KEY';

let habbits = [];
let currentHabbitId;

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
	},
	modal: {
		cover: document.querySelector('.cover'),
		formIconInput: document.querySelector('.popup__form input[name="icon"]')
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

function rerenderHeader(activeHabbit) {
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

	activeHabbit.days.forEach((day, index) => {
		currentDay++;
		contentHtml += `
			<div class="habbit">
				<div class="habbit__day">День ${currentDay}</div>
				<div class="habbit__comment">${day.comment}</div>
				<button class="habbit__delete" onclick="deleteDay(${index})">
					<img src="/img/delete.svg" alt="Удалить день ${currentDay}">
				</button>						
			</div>
		`;
	});

	const nextDay = ++currentDay;

	page.content.habbitsList.innerHTML = contentHtml;
	page.content.habbitFormNextDay.innerText = `День ${nextDay}`;
}

function addDays(event) {
	event.preventDefault();
	const form = event.target;

	const formData = validateAndGetFormData(form, ['comment']);

	if (!formData) {
		return;
	}

	habbits = habbits.map(habbit => {
		if (habbit.id !== currentHabbitId) {
			return habbit;
		}

		return {
			...habbit,
			days: habbit.days.concat([{ comment: formData.comment }])
		};
	});

	clearForm(form, ['comment']);

	rerender(currentHabbitId);
	saveData();
}

function deleteDay(dayIndex)
{
	habbits = habbits.map(habbit => {
		if (habbit.id !== currentHabbitId) {
			return habbit;
		}

		habbit.days.splice(dayIndex, 1);

		return habbit;
	});

	rerender(currentHabbitId);
	saveData();
}

function rerender(activeHabbitId) {
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);

	if (!activeHabbit) {
		return;
	}

	currentHabbitId = activeHabbit.id;

	rerenderMenu(activeHabbit);
	rerenderHeader(activeHabbit);
	rerenderContent(activeHabbit);
}

function toggleCreateModal() {
	page.modal.cover.classList.toggle('cover_hidden');
}

function setIcon(context, icon) {
	page.modal.formIconInput.value = icon;
	document.querySelector('.icon.icon_active').classList.remove('icon_active')
	context.classList.add('icon_active');
}

function addHabbit(event) {
	event.preventDefault();

	const form = event.target;
	const formData = validateAndGetFormData(form, ['name', 'icon', 'target']);
	
	const maxCurrentId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0);
	const habbitId = maxCurrentId + 1;

	habbits.push({
		"id": habbitId,
		"icon": formData.icon,
		"name": formData.name,
		"target": formData.target,
		"days": []
	});

	rerender(habbitId);
	saveData();
	toggleCreateModal();
	clearForm(form, ['name', 'target']);
}

function validateAndGetFormData(form, fields) {
	const formData = new FormData(form);
	const resultData = {};

	for (const field of fields) {
		form[field].classList.remove('error');
		const fieldValue = formData.get(field);

		if (!fieldValue) {
			form[field].classList.add('error');
			continue;
		}

		resultData[field] = fieldValue;
	}

	for (const field of fields) {
		if (!resultData[field]) {
			return;
		}
	}

	return resultData;
}

function clearForm(form, fields) {
	for (const field of fields) {
		form[field].value = '';
	}
}

(() => {
	loadData();
	rerender(habbits[0].id);
})();
