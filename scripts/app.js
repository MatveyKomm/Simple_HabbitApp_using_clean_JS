'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;

/* page */

const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    },
    content: {
        daysContainer: document.getElementById('days'),
        nextDay: document.querySelector('.habbit__day')
    },
    popup: {
        index: document.getElementById('addPopup'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
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

function togglePopup() {
    const removeCoverHiddenClassName = 'cover_hidden';
    if (page.popup.index.classList.contains(removeCoverHiddenClassName)) {
        page.popup.index.classList.remove(removeCoverHiddenClassName);
    } else {
        page.popup.index.classList.add(removeCoverHiddenClassName);
    }
}

function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = '';
    }
}

function validateForm(form, fields) {
    const formData = new FormData(form);
    const res = {};

    for (const field of fields) {
        const fieldValue = formData.get(field);
        form[field].classList.remove('error');
        if (!fieldValue) {
            form[field].classList.add('error');
        }
        res[field] = fieldValue;
    }

    const isValid = fields.some(field => res[field]);
    if (!isValid) {
        return;
    }
    return res;
}

/* render */

function rerenderMenu(activeHabbit) {
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

function rerenderHead(activeHabbit) {
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100;
    page.header.progressPercent.innerText = progress.toFixed(0) + '%';
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`);
}

function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = '';
    for (const index in activeHabbit.days) {
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `<div class="habbit__day">День ${Number(index) + 1}</div>
        <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
        <button class="habbit_delete" onclick="deleteDay(${index})">
            <img src="/images/delete.svg" alt="Удалить день ${Number(index) + 1}"/>
       </button>`;
        page.content.daysContainer.appendChild(element);
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);

    if (!activeHabbit) {
        return;
    }

    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

/* work with days */

function addDays(event) {
    event.preventDefault();

    const data = validateForm(event.target, ['comment']);
    if (!data) {
        return;
    }

    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{ comment: data.comment } ])
            }
        }
        return habbit
    });
    resetForm(event.target, ['comment']);
    rerender(globalActiveHabbitId);
    saveData();
}

function deleteDay(index) {
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1);
            return {
                ...habbit,
                days: habbit.days
            };
        }
        return habbit;
    })
    rerender(globalActiveHabbitId);
    saveData();
}

/* work with habbits */

function setIcon(context, icon) {
    page.popup.iconField.value = icon;
    const activeIcon = document.querySelector('.icon.icon_active');
    activeIcon.classList.remove('icon_active');
    context.classList.add('icon_active');
}

function addHabbit(event) {
    event.preventDefault();

    const data = validateForm(event.target, ['name', 'icon', 'target']);
    console.log(data)
    if (!data) {
        return;
    }
    const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0);
    habbits.push({
        id: maxId + 1,
        name: data.name,
        target: data.target,
        icon: data.icon,
        days: []
    });
    resetForm(event.target, ['name', 'target']);
    togglePopup();
    saveData();
    rerender(maxId + 1);
}

/* init */

(() => {
    loadData();
    if (habbits.length) {
        rerender(habbits[0].id)
    }
})();
