export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;

export const multiply = (a, b) => a * b;

export const divide = (a, b) => {
  if (b === 0) {
    return {
      error: true,
      message: "Nice try. Division by zero? Not today 😄"
    };
  }
  return a / b;
};

export const roundResult = (num) => {
  return Math.round((num + Number.EPSILON) * 1000000000) / 1000000000;
};

export const operate = (operator, a, b) => {
  const numA = Number(a);
  const numB = Number(b);

  let result;

  switch (operator) {
    case 'add':
      result = add(numA, numB);
      break;
    case 'subtract':
      result = subtract(numA, numB);
      break;
    case 'multiply':
      result = multiply(numA, numB);
      break;
    case 'divide':
      result = divide(numA, numB);
      break;
     case '+/-':
      result = multiply(numA, -1);
      break; 
    default:
      return {
        error: true,
        message: "Unknown operation 🤨"
      };
  }

  if (typeof result === 'object' && result.error) {
    return result;
  }

  return roundResult(result);
};