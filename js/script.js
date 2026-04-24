import { operate } from './mathEngine.js';

const displayElement = document.getElementById('display');
const numberButtons = document.querySelectorAll('.number-btn');
const decimalButton = document.getElementById('btn-decimal');
const clearButton = document.getElementById('btn-clear');
const backspaceButton = document.getElementById('btn-backspace');

let displayString = '0';
const MAX_CHARS = 12;

let firstOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;

function updateDisplay(value) {
    displayElement.innerText = value;
}

function clearDisplay() {
    displayString = '0';
    updateDisplay(displayString);
    firstOperand = null;
    currentOperator = null;
    shouldResetDisplay = false;
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

    if (shouldResetDisplay) {
        displayString = num;
        shouldResetDisplay = false;
        updateDisplay(displayString);
        return;
    }

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

    if (shouldResetDisplay) {
        displayString = '0.';
        shouldResetDisplay = false;
        updateDisplay(displayString);
        return;
    }

    if (displayString.length >= MAX_CHARS) {
        return;
    }

    if (!displayString.includes('.')) {
        displayString += '.';
        updateDisplay(displayString);
    }
}

const operatorButtons = document.querySelectorAll('.operator-btn');

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleOperator(button.getAttribute('data-operator'));
    });
});

function getSymbol(operator) {
    switch (operator) {
        case 'add':
            return '+';
        case 'subtract':
            return '-';
        case 'multiply':
            return '*';
        case 'divide':
            return '/';
        default:
            return '';
    }
}

function handleOperator(operator) {
    if (currentOperator !== null && !shouldResetDisplay) {
        evaluate();
    }

    firstOperand = displayString;
    currentOperator = operator;
    shouldResetDisplay = true;

    updateDisplay(`${firstOperand} ${getSymbol(operator)}`);
}

const equalsButton = document.getElementById('btn-equals');
equalsButton.addEventListener('click', evaluate);

function evaluate() {
    if (currentOperator === null || shouldResetDisplay) return;

    const result = operate(currentOperator, firstOperand, displayString);

    if (typeof result === 'object' && result.error) {
        updateDisplay(result.message);
        resetCalculator();
        return;

    }

    displayString = String(result).slice(0, MAX_CHARS);
    updateDisplay(displayString);

    firstOperand = displayString;
    currentOperator = null;
    shouldResetDisplay = true;
}

function resetCalculator() {
    displayString = '0';
    firstOperand = null;
    currentOperator = null;
    shouldResetDisplay = false;
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.getAttribute('data-number'));
    });
});

decimalButton.addEventListener('click', appendDecimal);
clearButton.addEventListener('click', clearDisplay);
backspaceButton.addEventListener('click', handleBackspace);

function physicalOperator(key) {
    switch (key) {
        case '+':
            return 'add';
        case '-':
            return 'subtract';
        case '*':
            return 'multiply';
        case '/':
            return 'divide';
        default:
            return '';
    }
}


window.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(physicalOperator(key))
    } else if (key === 'Enter' || key === '=') {
        evaluate();
    } else if (key === 'Backspace') {
        handleBackspace();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '.') {
        appendDecimal(); //
    }
});