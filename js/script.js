import { operate } from './mathEngine.js';

const displayElement = document.querySelector('.calculator__current');
const historyElement = document.querySelector('.calculator__history');
const numberButtons = document.querySelectorAll('.btn--number');
const operatorButtons = document.querySelectorAll('.btn--operator');

const decimalButton = document.querySelector('[data-action="decimal"]');
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="delete"]');
const toggleButton = document.querySelector('[data-action="toggle"]');
const equalsButton = document.querySelector('[data-action="equals"]');

let displayString = '0';
const MAX_CHARS = 12;

let firstOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;

function updateDisplay(value) {
    if (isNaN(parseFloat(value)) && value !== '0') {
        displayElement.textContent = value;
        return;
    }

    const numericValue = parseFloat(value.replace(',', '.'));
    displayElement.textContent = numericValue.toLocaleString('de-DE', { 
        maximumFractionDigits: 10 
    });
}

function updateHistory(content) {
    historyElement.textContent = content;
}

function clearDisplay() {
    displayString = '0';
    updateDisplay(displayString);
    updateHistory('');
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

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleOperator(button.getAttribute('data-operator'));
    });
});

function getSymbol(operator) {
    switch (operator) {
        case 'add': return '+';
        case 'subtract': return '-';
        case 'multiply': return '*';
        case 'divide': return '/';
        default: return '';
    }
}

function handleOperator(operator) {
    if (currentOperator !== null && !shouldResetDisplay) {
        evaluate();
    }

    firstOperand = displayString;
    currentOperator = operator;
    shouldResetDisplay = true;

    updateHistory(`${firstOperand} ${getSymbol(operator)}`);
}

equalsButton.addEventListener('click', evaluate);

function evaluate() {
    if (currentOperator === null || shouldResetDisplay) return;

    const result = operate(currentOperator, firstOperand, displayString);
    
    if (typeof result === 'object' && result.error) {
        updateDisplay(result.message);
        updateHistory('');
        resetCalculator();
        return;
    }
    
    updateHistory(`${firstOperand} ${getSymbol(currentOperator)} ${displayString} =`);

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
toggleButton.addEventListener('click', negativeToggle);

function negativeToggle() {
    if (displayString === '0') return;
    if (displayString.startsWith('-')) {
        displayString = displayString.slice(1);
    } else {
        displayString = '-' + displayString;
    }
    updateDisplay(displayString);
}

function physicalOperator(key) {
    switch (key) {
        case '+': return 'add';
        case '-': return 'subtract';
        case '*': return 'multiply';
        case '/': return 'divide';
        case 'n': return '+/-';
    }
}

window.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(physicalOperator(key));
    } else if (key === 'Enter' || key === '=') {
        evaluate();
    } else if (key === 'Backspace') {
        handleBackspace();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '.') {
        appendDecimal();
    } else if (key === 'n') {
        negativeToggle();
    }
});
