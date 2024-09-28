const screen = document.getElementById('calc-screen');
let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Function to update screen
function updateScreen(value) {
    screen.value = value;
}

// Clear everything
document.querySelector('.all-clear').addEventListener('click', () => {
    currentInput = '';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateScreen('');
});

// Handle number buttons and decimal
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.value;

        // Handling operators
        if (button.classList.contains('operator')) {
            handleOperator(value);
            return;
        }

        // Handling equal sign
        if (value === '=') {
            handleEqualSign();
            return;
        }

        // Append digits or decimal to input
        if (waitingForSecondOperand === true) {
            currentInput = value;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? value : currentInput + value;
        }

        updateScreen(currentInput);
    });
});

// Handle operators
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
        updateScreen(currentInput);
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
}

// Calculate based on operator
function calculate(first, second, operator) {
    if (operator === '+') return first + second;
    if (operator === '-') return first - second;
    if (operator === '*') return first * second;
    if (operator === '/') return first / second;
    return second;
}

// Handle equal sign press
function handleEqualSign() {
    const inputValue = parseFloat(currentInput);
    if (operator && waitingForSecondOperand === false) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = `${parseFloat(result.toFixed(7))}`;
        updateScreen(currentInput);
        firstOperand = result;
        operator = null;
        waitingForSecondOperand = true;
    }
}

// Keyboard support for inputs
document.addEventListener('keydown', (event) => {
    const { key } = event;
    if (!isNaN(key) || key === '.') {
        currentInput += key;
        updateScreen(currentInput);
    }
    if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
    }
    if (key === 'Enter' || key === '=') {
        handleEqualSign();
    }
    if (key === 'Escape') {
        document.querySelector('.all-clear').click();
    }
});
