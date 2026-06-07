(function () {
  "use strict";

  const referenceDate = new Date("2024-01-01T00:00:00");
  let productIdCounter = 0;

  const medicines = {
    Агалгін: new Date("2022-05-01"),
    Ношпа: new Date("2025-07-02"),
    Альфахолін: new Date("2024-12-21"),
    Аспірин: new Date("2022-08-15"),
    Аспаркам: new Date("2024-04-18"),
  };

  const fruits = [
    { name: "apple", price: 200 },
    { name: "orange", price: 300 },
    { name: "grapes", price: 750 },
  ];

  const tweets = [
    { id: "000", likes: 5, tags: ["js", "nodejs"] },
    { id: "001", likes: 2, tags: ["html", "css"] },
    { id: "002", likes: 17, tags: ["html", "js", "nodejs"] },
    { id: "003", likes: 8, tags: ["css", "react"] },
    { id: "004", likes: 0, tags: ["js", "nodejs", "react"] },
  ];

  function resetProductCounter() {
    productIdCounter = 0;
  }

  function nextProductId() {
    productIdCounter += 1;
    return `product-${String(productIdCounter).padStart(3, "0")}`;
  }

  function createProduct(obj, callback) {
    const product = {
      id: nextProductId(),
      ...obj,
    };
    const callbackResult = callback(product);
    return {
      product,
      callbackResult,
    };
  }

  function logProduct(product) {
    console.log("logProduct:", product);
    return `Товар ${product.id}: ${product.name}, ціна ${product.price}, кількість ${product.quantity}`;
  }

  function logTotalPrice(product) {
    const totalPrice = product.price * product.quantity;
    const result = `Загальна вартість ${product.name}: ${totalPrice} грн`;
    console.log("logTotalPrice:", result);
    return result;
  }

  function getActualMedicineNames(source, currentDate = referenceDate) {
    return Object.entries(source)
      .filter(([, expiresAt]) => expiresAt > currentDate)
      .sort((left, right) => left[1] - right[1])
      .map(([name]) => name);
  }

  function applyFruitDiscount(source, discount = 0.2) {
    return source.map((fruit, index) => ({
      id: index + 1,
      name: fruit.name,
      oldPrice: fruit.price,
      price: Number((fruit.price * (1 - discount)).toFixed(2)),
    }));
  }

  class Client {
    #login;
    #email;

    constructor(login, email) {
      this.#login = login;
      this.#email = email;
    }

    get login() {
      return this.#login;
    }

    set login(value) {
      this.#login = value;
    }

    get email() {
      return this.#email;
    }

    set email(value) {
      this.#email = value;
    }
  }

  function countTags(source) {
    return source
      .flatMap((tweet) => tweet.tags)
      .reduce((accumulator, tag) => {
        accumulator[tag] = (accumulator[tag] || 0) + 1;
        return accumulator;
      }, {});
  }

  function checkBrackets(str) {
    const stack = [];
    const pairs = {
      "(": ")",
      "{": "}",
      "[": "]",
    };
    const closing = new Set(Object.values(pairs));

    for (const char of str) {
      if (Object.prototype.hasOwnProperty.call(pairs, char)) {
        stack.push(char);
      } else if (closing.has(char)) {
        const last = stack.pop();
        if (!last || pairs[last] !== char) {
          return false;
        }
      }
    }

    return stack.length === 0;
  }

  function flattenValues(data) {
    return data.flatMap((item) => item.values);
  }

  function areAllEven(numbers) {
    return numbers.every((number) => number % 2 === 0);
  }

  function sortStringsAlphabetically(strings) {
    return [...strings].sort((left, right) => left.localeCompare(right));
  }

  class Calculator {
    constructor() {
      this.result = 0;
    }

    number(value) {
      this.result = value;
      return this;
    }

    add(value) {
      this.result += value;
      return this;
    }

    subtract(value) {
      this.result -= value;
      return this;
    }

    divide(value) {
      if (value === 0) {
        throw new Error("Ділення на нуль неможливе");
      }
      this.result /= value;
      return this;
    }

    multiply(value) {
      this.result *= value;
      return this;
    }

    getResult() {
      return this.result;
    }
  }

  function formatValue(value) {
    return JSON.stringify(value, null, 2);
  }

  function formatDate(date) {
    return date.toLocaleDateString("uk-UA");
  }

  function logToConsole(message) {
    console.log(message);
    const consoleBox = document.getElementById("lab5-console");
    if (consoleBox) {
      const timestamp = new Date().toLocaleTimeString("uk-UA", { hour12: false });
      consoleBox.textContent += `[${timestamp}] ${message}\n`;
      consoleBox.scrollTop = consoleBox.scrollHeight;
    }
  }

  function writeOutput(taskId, text) {
    const target = document.getElementById(`task-${taskId}-output`);
    if (target) {
      target.textContent = text;
    }
    logToConsole(`Task ${taskId}: ${text.replace(/\n/g, " | ")}`);
  }

  function runTask(taskId) {
    switch (taskId) {
      case "1-1": {
        resetProductCounter();
        const productInput = { name: "Навчальний блокнот", price: 180, quantity: 4 };
        const productLog = createProduct(productInput, logProduct);
        const totalLog = createProduct(productInput, logTotalPrice);
        writeOutput(
          "1-1",
          [
            "createProduct(obj, callback)",
            productLog.callbackResult,
            totalLog.callbackResult,
            `created product = ${formatValue(productLog.product)}`,
          ].join("\n")
        );
        break;
      }
      case "1-3": {
        const result = getActualMedicineNames(medicines, referenceDate);
        writeOutput(
          "1-3",
          [
            `контрольна дата = ${formatDate(referenceDate)}`,
            `актуальні препарати = ${formatValue(result)}`,
          ].join("\n")
        );
        break;
      }
      case "1-5": {
        const result = applyFruitDiscount(fruits);
        writeOutput("1-5", `знижка 20% і додані id:\n${formatValue(result)}`);
        break;
      }
      case "1-7": {
        const client = new Client("study_max", "max@student.example");
        const before = { login: client.login, email: client.email };
        client.login = "study_admin";
        client.email = "admin@student.example";
        const after = { login: client.login, email: client.email };
        writeOutput(
          "1-7",
          [`before = ${formatValue(before)}`, `after setter = ${formatValue(after)}`].join("\n")
        );
        break;
      }
      case "1-9": {
        const result = countTags(tweets);
        writeOutput("1-9", `кількість тегів:\n${formatValue(result)}`);
        break;
      }
      case "1-10": {
        const validCode = "function someFn() { return [1, 2, 3].map((item) => item * 2); }";
        const invalidCode = "function broken() { return [1, 2, 3); }";
        writeOutput(
          "1-10",
          [`valid code -> ${checkBrackets(validCode)}`, `invalid code -> ${checkBrackets(invalidCode)}`].join("\n")
        );
        break;
      }
      case "2-1": {
        const data = [
          { id: 1, values: [1, 2, 3] },
          { id: 2, values: [4, 5, 6] },
          { id: 3, values: [7, 8, 9] },
        ];
        writeOutput("2-1", `flat values = ${formatValue(flattenValues(data))}`);
        break;
      }
      case "2-3": {
        const numbers = [2, 4, 6, 8, 10];
        writeOutput("2-3", `${formatValue(numbers)}\nусі парні -> ${areAllEven(numbers)}`);
        break;
      }
      case "2-5": {
        const stringArray = ["banana", "orange", "apple", "pear"];
        writeOutput(
          "2-5",
          [`source = ${formatValue(stringArray)}`, `sorted = ${formatValue(sortStringsAlphabetically(stringArray))}`].join("\n")
        );
        break;
      }
      case "2-7": {
        const calc = new Calculator();
        const result = calc.number(10).add(5).subtract(3).multiply(4).divide(2).getResult();
        let divideError = "";
        try {
          calc.divide(0);
        } catch (error) {
          divideError = error.message;
        }
        writeOutput(
          "2-7",
          [`10 + 5 - 3, * 4, / 2 = ${result}`, `перевірка divide(0): ${divideError}`].join("\n")
        );
        break;
      }
      default:
        break;
    }
  }

  function runAllTasks() {
    const consoleBox = document.getElementById("lab5-console");
    if (consoleBox) {
      consoleBox.textContent = "";
    }
    ["1-1", "1-3", "1-5", "1-7", "1-9", "1-10", "2-1", "2-3", "2-5", "2-7"].forEach(runTask);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-run-lab5]").forEach((button) => {
      button.addEventListener("click", () => runTask(button.dataset.runLab5));
    });

    const runAllButton = document.getElementById("run-all-lab5");
    if (runAllButton) {
      runAllButton.addEventListener("click", runAllTasks);
    }
  });

  window.Lab5 = {
    Calculator,
    Client,
    applyFruitDiscount,
    areAllEven,
    checkBrackets,
    countTags,
    createProduct,
    flattenValues,
    getActualMedicineNames,
    logProduct,
    logTotalPrice,
    resetProductCounter,
    runAllTasks,
    runTask,
    sortStringsAlphabetically,
    testData: {
      fruits,
      medicines,
      referenceDate,
      tweets,
    },
  };
})();
