
function submitForm() {
    const inputText = document.querySelector('.input').value;
    document.querySelector('.panel').innerText = inputText;
    document.querySelector('.input').value = '';
    document.querySelector('.notification').classList.add('notification_active');
};
function changeTextButtonClicked() {
    submitForm();
};

function inputChanged(e) {
    if (e.code == 'Enter') {
        submitForm();
    }
};

