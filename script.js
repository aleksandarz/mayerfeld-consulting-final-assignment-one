const displayElement = document.getElementById('display');
const numberButtons = document.querySelectorAll('.number-btn');
const decimalButton = document.getElementById('btn-decimal');
const clearButton = document.getElementById('btn-clear');
const backspaceButton = document.getElementById('btn-backspace');

let displayString = '0';
const MAX_CHARS = 12; 

function updateDisplay(value) {
    displayElement.innerText = value;
}

function clearDisplay() {
    displayString = '0';
    updateDisplay(displayString);
}

function handleBackspace() {
    if (displayString.length > 1) {
        displayString = displayString.slice(0, -1);
    } else {
        displayString = '0';
    }
    updateDisplay(displayString);
}

function appendNumber(num) {

    if (displayString.length >= MAX_CHARS) {
        return; 
    }

    if (displayString === '0') {
        displayString = num;
    } else {
        displayString += num;
    }
    updateDisplay(displayString);
}

function appendDecimal() {
    if (displayString.length >= MAX_CHARS) {
        return; 
    }

    if (!displayString.includes('.')) {
        displayString += '.';
        updateDisplay(displayString);
    }
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.getAttribute('data-number'));
    });
});

decimalButton.addEventListener('click', appendDecimal);
clearButton.addEventListener('click', clearDisplay);
backspaceButton.addEventListener('click', handleBackspace);