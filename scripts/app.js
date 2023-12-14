'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

/* page */

const page = {
    menu: document.querySelector('.menu__list')
}

/* utils */

function loadData() {
    const habbitStrings = localStorage.getItem(HABBIT_KEY);
    const habbitsArray = JSON.parse(habbitStrings);

    if (Array.isArray(habbitsArray), habbitsArray.length) {
        habbits = habbitsArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* render */

function rerenderMenu(activeHabbit) {
    if (!activeHabbit) {
        return;
    }

    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if (!existed) {
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add('menu__item');
            element.addEventListener('click', () => rerender(habbit.id));
            element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;

            if (activeHabbit.id === habbit.id) {
                element.classList.add('menu__item__active');
            }
            page.menu.appendChild(element);
            continue;
        }

        if (activeHabbit.id === habbit.id ) {
            existed.classList.add('menu__item__active');
        } else {
            existed.classList.remove('menu__item__active');
        }
    }
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
}

/* init */

(() => {
    loadData();
    if (habbits.length) {
        rerender(habbits[0].id)
    }
})();
