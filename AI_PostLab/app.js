const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const addBubble = (text, type) => {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const normalizeExpression = (text) => {
  let cleaned = text.replace(/×/g, "*").replace(/÷/g, "/");
  const singleArgFns = [
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "atan",
    "sinh",
    "cosh",
    "tanh",
    "sind",
    "cosd",
    "tand",
    "log",
    "ln",
    "sqrt",
    "cbrt",
    "abs",
    "exp",
    "floor",
    "ceil",
    "round",
  ];
  const tokenPattern = "([+-]?(?:\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?|pi|e))";
  for (const fn of singleArgFns) {
    const re = new RegExp(`\\b${fn}\\s+${tokenPattern}\\b`, "gi");
    cleaned = cleaned.replace(re, `${fn}($1)`);
  }
  return cleaned.replace(/\s+/g, "");
};

const FUNCTIONS = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  asin: (x) => Math.asin(x),
  acos: (x) => Math.acos(x),
  atan: (x) => Math.atan(x),
  sinh: (x) => Math.sinh(x),
  cosh: (x) => Math.cosh(x),
  tanh: (x) => Math.tanh(x),
  sind: (x) => Math.sin((x * Math.PI) / 180),
  cosd: (x) => Math.cos((x * Math.PI) / 180),
  tand: (x) => Math.tan((x * Math.PI) / 180),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  sqrt: (x) => Math.sqrt(x),
  cbrt: (x) => Math.cbrt(x),
  abs: (x) => Math.abs(x),
  exp: (x) => Math.exp(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  round: (x) => Math.round(x),
  pow: (a, b) => Math.pow(a, b),
  min: (...args) => Math.min(...args),
  max: (...args) => Math.max(...args),
  mod: (a, b) => a % b,
};

const CONSTANTS = {
  pi: Math.PI,
  e: Math.E,
};

const OPERATORS = {
  "+": { precedence: 2, assoc: "L", args: 2, fn: (a, b) => a + b },
  "-": { precedence: 2, assoc: "L", args: 2, fn: (a, b) => a - b },
  "*": { precedence: 3, assoc: "L", args: 2, fn: (a, b) => a * b },
  "/": { precedence: 3, assoc: "L", args: 2, fn: (a, b) => a / b },
  "%": { precedence: 3, assoc: "L", args: 2, fn: (a, b) => a % b },
  "^": { precedence: 4, assoc: "R", args: 2, fn: (a, b) => Math.pow(a, b) },
  "u-": { precedence: 5, assoc: "R", args: 1, fn: (a) => -a },
  "!": { precedence: 6, assoc: "L", args: 1, fn: (a) => factorial(a) },
};

const factorial = (value) => {
  if (!Number.isFinite(value)) return NaN;
  if (value < 0) return NaN;
  if (!Number.isInteger(value)) return NaN;
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
};

const tokenize = (input) => {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (/[0-9.]/.test(char)) {
      let num = char;
      i += 1;
      while (i < input.length && /[0-9.]/.test(input[i])) {
        num += input[i];
        i += 1;
      }
      if (i < input.length && /[eE]/.test(input[i])) {
        num += input[i];
        i += 1;
        if (/[+-]/.test(input[i])) {
          num += input[i];
          i += 1;
        }
        while (i < input.length && /[0-9]/.test(input[i])) {
          num += input[i];
          i += 1;
        }
      }
      tokens.push({ type: "number", value: parseFloat(num) });
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let name = char;
      i += 1;
      while (i < input.length && /[a-zA-Z0-9]/.test(input[i])) {
        name += input[i];
        i += 1;
      }
      tokens.push({ type: "name", value: name.toLowerCase() });
      continue;
    }

    if ("+-*/^%!(),".includes(char)) {
      tokens.push({ type: "symbol", value: char });
      i += 1;
      continue;
    }

    throw new Error("Invalid character.");
  }

  return tokens;
};

const toRpn = (tokens) => {
  const output = [];
  const stack = [];
  const argCountStack = [];
  let prevToken = null;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token.type === "number") {
      output.push(token);
      prevToken = token;
      continue;
    }

    if (token.type === "name") {
      stack.push({ type: "function", value: token.value });
      prevToken = token;
      continue;
    }

    if (token.type === "symbol" && token.value === ",") {
      while (stack.length && stack[stack.length - 1].value !== "(") {
        output.push(stack.pop());
      }
      if (!stack.length) throw new Error("Misplaced comma.");
      if (argCountStack.length) {
        argCountStack[argCountStack.length - 1] += 1;
      }
      prevToken = token;
      continue;
    }

    if (token.type === "symbol" && token.value === "(") {
      stack.push(token);
      if (prevToken && prevToken.type === "name") {
        argCountStack.push(1);
      }
      prevToken = token;
      continue;
    }

    if (token.type === "symbol" && token.value === ")") {
      while (stack.length && stack[stack.length - 1].value !== "(") {
        output.push(stack.pop());
      }
      if (!stack.length) throw new Error("Mismatched parentheses.");
      stack.pop();
      if (stack.length && stack[stack.length - 1].type === "function") {
        const fnToken = stack.pop();
        const argCount = argCountStack.length ? argCountStack.pop() : 1;
        output.push({ type: "function", value: fnToken.value, args: argCount });
      }
      prevToken = token;
      continue;
    }

    if (token.type === "symbol") {
      let op = token.value;
      if (
        op === "-" &&
        (!prevToken || (prevToken.type === "symbol" && prevToken.value !== ")" && prevToken.value !== "!"))
      ) {
        op = "u-";
      }
      const opInfo = OPERATORS[op];
      if (!opInfo) throw new Error("Unknown operator.");

      while (stack.length) {
        const top = stack[stack.length - 1];
        const topOp = top.type === "operator" ? top.value : top.type === "symbol" ? top.value : null;
        if (!topOp || !OPERATORS[topOp]) break;
        const topInfo = OPERATORS[topOp];
        const shouldPop =
          (opInfo.assoc === "L" && opInfo.precedence <= topInfo.precedence) ||
          (opInfo.assoc === "R" && opInfo.precedence < topInfo.precedence);
        if (!shouldPop) break;
        output.push(stack.pop());
      }

      stack.push({ type: "operator", value: op });
      prevToken = token;
    }
  }

  while (stack.length) {
    const token = stack.pop();
    if (token.value === "(") throw new Error("Mismatched parentheses.");
    output.push(token);
  }

  return output;
};

const evalRpn = (rpn) => {
  const stack = [];
  for (const token of rpn) {
    if (token.type === "number") {
      stack.push(token.value);
      continue;
    }
    if (token.type === "function") {
      if (token.value in CONSTANTS) {
        stack.push(CONSTANTS[token.value]);
        continue;
      }
      const fn = FUNCTIONS[token.value];
      if (!fn) throw new Error("Unknown function.");
      const argCount = token.args ?? fn.length;
      if (stack.length < argCount) throw new Error("Missing function arguments.");
      const args = stack.splice(stack.length - argCount, argCount);
      const value = fn(...args);
      stack.push(value);
      continue;
    }
    if (token.type === "operator") {
      const op = OPERATORS[token.value];
      if (stack.length < op.args) throw new Error("Invalid expression.");
      const args = stack.splice(stack.length - op.args, op.args);
      const value = op.fn(...args);
      stack.push(value);
      continue;
    }
  }

  if (stack.length !== 1) throw new Error("Invalid expression.");
  return stack[0];
};

const evaluateExpression = (rawText) => {
  const input = normalizeExpression(rawText);
  if (!input) {
    return "Please enter a math expression like `2*(3+4)` or `sin(pi/2)`.";
  }

  try {
    const tokens = tokenize(input);
    const rpn = toRpn(tokens);
    const result = evalRpn(rpn);
    if (Number.isFinite(result)) return `Answer: ${result}`;
    return "That expression does not return a finite number.";
  } catch (error) {
    return "I could not evaluate that expression. Use valid math like `sin(pi/2)` or `5!`.";
  }
};

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addBubble(message, "user");
  userInput.value = "";

  window.setTimeout(() => {
    addBubble(evaluateExpression(message), "bot");
  }, 200);
});
