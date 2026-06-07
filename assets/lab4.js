(function () {
  "use strict";

  const credentials = {
    Admin: "admin123",
    User: "user123",
  };

  const demoMatrix = [
    [8, -3, 12],
    [-7, 4, -1],
    [15, -9, 6],
  ];

  function toNumber(value) {
    if (value === null || String(value).trim() === "") {
      return Number.NaN;
    }
    return Number(value);
  }

  function classifyNumber(value) {
    const number = toNumber(value);
    if (Number.isNaN(number)) {
      return "Некоректне значення";
    }
    if (number > 0) {
      return "Число додатнє";
    }
    if (number < 0) {
      return "Число від'ємне";
    }
    return "Число дорівнює нулю";
  }

  function getSeason(number) {
    switch (String(number).trim()) {
      case "1":
        return "зима";
      case "2":
        return "весна";
      case "3":
        return "літо";
      case "4":
        return "осінь";
      default:
        return "невідоме значення";
    }
  }

  function authenticate(login, password) {
    if (login === null || String(login).trim() === "") {
      return "Cancelled";
    }
    const normalizedLogin = String(login).trim();
    if (!Object.prototype.hasOwnProperty.call(credentials, normalizedLogin)) {
      return "I don't know you";
    }
    if (password === credentials[normalizedLogin]) {
      return `Hello, ${normalizedLogin}`;
    }
    if (password === null || String(password).trim() === "") {
      return "Cancelled";
    }
    return "Wrong password";
  }

  function makeTransaction(quantity, pricePerDroid) {
    const totalPrice = quantity * pricePerDroid;
    return `You ordered ${quantity} droids worth ${totalPrice} credits!`;
  }

  function checkForSpam(message) {
    const normalized = String(message).toLowerCase();
    return normalized.includes("spam") || normalized.includes("sale");
  }

  function filterArray(numbers, value) {
    const filtered = [];
    for (const number of numbers) {
      if (number > value) {
        filtered.push(number);
      }
    }
    return filtered;
  }

  function findIndexOfMaxEvenValue(numbers) {
    let max = -Infinity;
    let index = -1;
    numbers.forEach((number, currentIndex) => {
      if (number % 2 === 0 && number > max) {
        max = number;
        index = currentIndex;
      }
    });
    return index;
  }

  function findIndexOfMinEvenIndex(numbers) {
    let min = Infinity;
    let index = -1;
    numbers.forEach((number, currentIndex) => {
      if (currentIndex % 2 === 0 && number < min) {
        min = number;
        index = currentIndex;
      }
    });
    return index;
  }

  function insertionSortAscending(numbers) {
    const sorted = [...numbers];
    for (let i = 1; i < sorted.length; i += 1) {
      const current = sorted[i];
      let j = i - 1;
      while (j >= 0 && sorted[j] > current) {
        sorted[j + 1] = sorted[j];
        j -= 1;
      }
      sorted[j + 1] = current;
    }
    return sorted;
  }

  function processVariantOneArray(numbers) {
    const source = [...numbers];
    const swapped = [...numbers];
    const maxEvenIndex = findIndexOfMaxEvenValue(swapped);
    const minEvenIndexIndex = findIndexOfMinEvenIndex(swapped);

    if (maxEvenIndex !== -1 && minEvenIndexIndex !== -1) {
      [swapped[maxEvenIndex], swapped[minEvenIndexIndex]] = [
        swapped[minEvenIndexIndex],
        swapped[maxEvenIndex],
      ];
    }

    return {
      source,
      maxEvenIndex,
      minEvenIndexIndex,
      swapped,
      sorted: insertionSortAscending(swapped),
    };
  }

  function splitMatrixNumbers(matrix, replacementValue) {
    const flat = matrix.flat();
    const positives = flat.filter((number) => number > 0);
    const negatives = flat.filter((number) => number < 0);
    const updatedPositives = [...positives];
    const replacement = Number(replacementValue);

    if (updatedPositives.length >= 3 && !Number.isNaN(replacement) && replacement < 0) {
      updatedPositives[2] = replacement;
    }

    return {
      matrix,
      positives,
      negatives,
      updatedPositives,
    };
  }

  function isValidDate(value) {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
    if (!match) {
      return false;
    }
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  function validateRegistrationForm(data) {
    const errors = [];
    if (!data.name || !data.name.trim()) {
      errors.push("Ім'я є обов'язковим полем");
    }
    if (!/^-?\d+$/.test(data.age || "")) {
      errors.push("Ціле число має містити тільки цифри");
    }
    if (!/^-?\d+([.,]\d+)?$/.test(data.rating || "")) {
      errors.push("Дійсне число має бути у форматі 87.5 або 87,5");
    }
    if (!isValidDate(data.date || "")) {
      errors.push("Дата має відповідати формату DD.MM.YYYY і бути реальною датою");
    }
    if (!data.password) {
      errors.push("Пароль є обов'язковим полем");
    }
    if (data.password !== data.confirm) {
      errors.push("Паролі не збігаються");
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  function formatArray(numbers) {
    return `[${numbers.join(", ")}]`;
  }

  function formatMatrix(matrix) {
    return matrix.map((row) => `[${row.join(", ")}]`).join("\n");
  }

  function writeOutput(taskNumber, text) {
    const target = document.getElementById(`task-${taskNumber}-output`);
    if (target) {
      target.textContent = text;
    }
    logToConsole(`Task ${taskNumber}: ${text.replace(/\n/g, " | ")}`);
  }

  function logToConsole(message) {
    console.log(message);
    const consoleBox = document.getElementById("lab4-console");
    if (consoleBox) {
      const timestamp = new Date().toLocaleTimeString("uk-UA", { hour12: false });
      consoleBox.textContent += `[${timestamp}] ${message}\n`;
      consoleBox.scrollTop = consoleBox.scrollHeight;
    }
  }

  function runTask(taskNumber) {
    switch (Number(taskNumber)) {
      case 1: {
        const value = "-12";
        writeOutput(1, `value = ${value}\n${classifyNumber(value)}`);
        break;
      }
      case 2: {
        const number = "2";
        writeOutput(2, `number = ${number}\nresult = ${getSeason(number)}`);
        break;
      }
      case 3: {
        writeOutput(3, `login = Admin\npassword = admin123\n${authenticate("Admin", "admin123")}`);
        break;
      }
      case 4: {
        writeOutput(4, makeTransaction(5, 3000));
        break;
      }
      case 5: {
        const checks = [
          ["Latest SALE for students", checkForSpam("Latest SALE for students")],
          ["Regular study message", checkForSpam("Regular study message")],
        ];
        writeOutput(5, checks.map(([message, result]) => `"${message}" -> ${result}`).join("\n"));
        break;
      }
      case 6: {
        const numbers = [1, 8, 3, 14, 5, 21];
        const value = 7;
        writeOutput(6, `numbers = ${formatArray(numbers)}\nvalue = ${value}\nresult = ${formatArray(filterArray(numbers, value))}`);
        break;
      }
      case 7: {
        const result = processVariantOneArray([12, 7, 4, 19, 2, 8, 15]);
        writeOutput(
          7,
          [
            `source = ${formatArray(result.source)}`,
            `max even index = ${result.maxEvenIndex}`,
            `min even-index element index = ${result.minEvenIndexIndex}`,
            `after swap = ${formatArray(result.swapped)}`,
            `insertion sort = ${formatArray(result.sorted)}`,
          ].join("\n")
        );
        break;
      }
      case 8: {
        const result = splitMatrixNumbers(demoMatrix, -25);
        writeOutput(
          8,
          [
            `matrix:\n${formatMatrix(result.matrix)}`,
            `positives = ${formatArray(result.positives)}`,
            `negatives = ${formatArray(result.negatives)}`,
            `updated positives = ${formatArray(result.updatedPositives)}`,
          ].join("\n")
        );
        break;
      }
      case 9: {
        const form = document.getElementById("registration-form");
        const data = Object.fromEntries(new FormData(form));
        const result = validateRegistrationForm(data);
        const text = result.valid
          ? "Форма валідна"
          : `Форма має помилки:\n${result.errors.map((error) => `- ${error}`).join("\n")}`;
        writeOutput(9, text);
        break;
      }
      default:
        break;
    }
  }

  function runPromptTask(taskNumber) {
    if (Number(taskNumber) === 1) {
      const value = window.prompt("Введіть число");
      const result = classifyNumber(value);
      console.log(`Task 1 prompt value: ${value}`);
      window.alert(result);
      writeOutput(1, `value = ${value}\n${result}`);
    }

    if (Number(taskNumber) === 2) {
      const number = window.prompt("Введіть число 1-4");
      const result = getSeason(number);
      console.log(`Task 2 prompt number: ${number}, result: ${result}`);
      window.alert(result);
      writeOutput(2, `number = ${number}\nresult = ${result}`);
    }

    if (Number(taskNumber) === 3) {
      const login = window.prompt("Введіть логін: Admin або User");
      let password = "";
      if (login && credentials[String(login).trim()]) {
        password = window.prompt("Введіть пароль");
      }
      const result = authenticate(login, password);
      console.log(`Task 3 prompt login: ${login}`);
      window.alert(result);
      writeOutput(3, `login = ${login}\n${result}`);
    }

    if (Number(taskNumber) === 8) {
      const replacement = window.prompt("Введіть від'ємне число для заміни третього додатного елемента", "-25");
      const result = splitMatrixNumbers(demoMatrix, replacement);
      writeOutput(
        8,
        [
          `matrix:\n${formatMatrix(result.matrix)}`,
          `positives = ${formatArray(result.positives)}`,
          `negatives = ${formatArray(result.negatives)}`,
          `updated positives = ${formatArray(result.updatedPositives)}`,
        ].join("\n")
      );
    }
  }

  function runAllTasks() {
    const consoleBox = document.getElementById("lab4-console");
    if (consoleBox) {
      consoleBox.textContent = "";
    }
    for (let taskNumber = 1; taskNumber <= 9; taskNumber += 1) {
      runTask(taskNumber);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-run-task]").forEach((button) => {
      button.addEventListener("click", () => runTask(button.dataset.runTask));
    });

    document.querySelectorAll("[data-prompt-task]").forEach((button) => {
      button.addEventListener("click", () => runPromptTask(button.dataset.promptTask));
    });

    const runAllButton = document.getElementById("run-all-lab4");
    if (runAllButton) {
      runAllButton.addEventListener("click", runAllTasks);
    }

    const registrationForm = document.getElementById("registration-form");
    if (registrationForm) {
      registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        runTask(9);
      });
    }
  });

  window.Lab4 = {
    authenticate,
    checkForSpam,
    classifyNumber,
    filterArray,
    getSeason,
    insertionSortAscending,
    makeTransaction,
    processVariantOneArray,
    splitMatrixNumbers,
    validateRegistrationForm,
    runTask,
    runAllTasks,
  };
})();
