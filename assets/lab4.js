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

  const slideshowImages = [
    {
      src: "assets/study-dashboard.svg",
      alt: "StudyTask dashboard illustration",
      caption: "Панель StudyTask",
    },
    {
      src: "assets/slide-planning.svg",
      alt: "Planning board illustration",
      caption: "Планування задач",
    },
    {
      src: "assets/slide-progress.svg",
      alt: "Progress chart illustration",
      caption: "Контроль прогресу",
    },
  ];

  const slideshowState = {
    currentIndex: 0,
    timerId: null,
  };

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

  function selectionSortDescending(numbers) {
    const sorted = [...numbers];
    for (let i = 0; i < sorted.length - 1; i += 1) {
      let maxIndex = i;
      for (let j = i + 1; j < sorted.length; j += 1) {
        if (sorted[j] > sorted[maxIndex]) {
          maxIndex = j;
        }
      }
      if (maxIndex !== i) {
        [sorted[i], sorted[maxIndex]] = [sorted[maxIndex], sorted[i]];
      }
    }
    return sorted;
  }

  function getPositionStats(numbers, parity) {
    const filtered = numbers
      .map((value, index) => ({ value, position: index + 1 }))
      .filter((item) => item.position % 2 === parity);

    if (!filtered.length) {
      return null;
    }

    return filtered.reduce(
      (stats, item) => ({
        max: item.value > stats.max.value ? item : stats.max,
        min: item.value < stats.min.value ? item : stats.min,
      }),
      { max: filtered[0], min: filtered[0] }
    );
  }

  function processVariantFiveArray(numbers) {
    const source = [...numbers];
    return {
      source,
      oddPositions: getPositionStats(source, 1),
      evenPositions: getPositionStats(source, 0),
      sorted: selectionSortDescending(source),
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

  function formatArray(numbers) {
    return `[${numbers.join(", ")}]`;
  }

  function formatMatrix(matrix) {
    return matrix.map((row) => `[${row.join(", ")}]`).join("\n");
  }

  function parseNumbersInput(value) {
    return String(value)
      .split(/[,\s;]+/)
      .map((item) => Number(item.trim()))
      .filter((number) => !Number.isNaN(number));
  }

  function formatPositionStats(title, stats) {
    if (!stats) {
      return `${title}: немає елементів`;
    }
    return [
      `${title}:`,
      `max = ${stats.max.value}, position = ${stats.max.position}`,
      `min = ${stats.min.value}, position = ${stats.min.position}`,
    ].join("\n");
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

  function renderSlideshow() {
    const image = document.getElementById("slideshow-image");
    const caption = document.getElementById("slideshow-caption");
    const counter = document.getElementById("slideshow-counter");
    const slide = slideshowImages[slideshowState.currentIndex];

    if (!image || !caption || !counter || !slide) {
      return;
    }

    image.src = slide.src;
    image.alt = slide.alt;
    caption.textContent = slide.caption;
    counter.textContent = `${slideshowState.currentIndex + 1} / ${slideshowImages.length}`;
  }

  function getSlideshowStatusText() {
    return [
      "Слайд-шоу ініціалізовано",
      `images = ${slideshowImages.length}`,
      `current = ${slideshowImages[slideshowState.currentIndex].caption}`,
    ].join("\n");
  }

  function updateSlideshowStatusBox() {
    const target = document.getElementById("task-9-output");
    if (target) {
      target.textContent = getSlideshowStatusText();
    }
  }

  function applySlideshowSize() {
    const image = document.getElementById("slideshow-image");
    const sizeInput = document.getElementById("slideshow-size");
    if (!image || !sizeInput) {
      return;
    }
    const size = Number(sizeInput.value);
    image.style.width = `${Number.isFinite(size) ? size : 520}px`;
  }

  function changeSlide(direction) {
    const nextIndex = slideshowState.currentIndex + direction;
    if (nextIndex < 0) {
      slideshowState.currentIndex = slideshowImages.length - 1;
    } else if (nextIndex >= slideshowImages.length) {
      slideshowState.currentIndex = 0;
    } else {
      slideshowState.currentIndex = nextIndex;
    }
    renderSlideshow();
    updateSlideshowStatusBox();
  }

  function stopSlideshow() {
    if (slideshowState.timerId) {
      window.clearInterval(slideshowState.timerId);
      slideshowState.timerId = null;
    }
  }

  function startSlideshow() {
    const intervalInput = document.getElementById("slideshow-interval");
    const interval = Number(intervalInput ? intervalInput.value : 1500);
    stopSlideshow();
    slideshowState.timerId = window.setInterval(
      () => changeSlide(1),
      Math.max(Number.isFinite(interval) ? interval : 1500, 500)
    );
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
        const input = document.getElementById("task-7-numbers");
        const numbers = input ? parseNumbersInput(input.value) : [12, -7, 4, 19, 2, 8, 15, -3];
        const result = processVariantFiveArray(numbers);
        writeOutput(
          7,
          [
            `source = ${formatArray(result.source)}`,
            formatPositionStats("odd positions", result.oddPositions),
            formatPositionStats("even positions", result.evenPositions),
            `selection sort descending = ${formatArray(result.sorted)}`,
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
        applySlideshowSize();
        renderSlideshow();
        updateSlideshowStatusBox();
        logToConsole(`Task 9: ${getSlideshowStatusText().replace(/\n/g, " | ")}`);
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

  function applyUrlAutomation() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("autorun") !== "1") {
      return;
    }

    runAllTasks();

    const slideIndex = Number(params.get("slide"));
    if (Number.isInteger(slideIndex) && slideIndex >= 1 && slideIndex <= slideshowImages.length) {
      slideshowState.currentIndex = slideIndex - 1;
      renderSlideshow();
      updateSlideshowStatusBox();
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

    const slideshowSizeInput = document.getElementById("slideshow-size");
    if (slideshowSizeInput) {
      slideshowSizeInput.addEventListener("input", applySlideshowSize);
    }

    const slideshowStartButton = document.getElementById("slideshow-start");
    if (slideshowStartButton) {
      slideshowStartButton.addEventListener("click", startSlideshow);
    }

    const slideshowStopButton = document.getElementById("slideshow-stop");
    if (slideshowStopButton) {
      slideshowStopButton.addEventListener("click", stopSlideshow);
    }

    document.querySelectorAll("[data-slide-direction]").forEach((button) => {
      button.addEventListener("click", () => changeSlide(Number(button.dataset.slideDirection)));
    });

    runTask(9);
    applyUrlAutomation();
  });

  window.Lab4 = {
    authenticate,
    checkForSpam,
    classifyNumber,
    filterArray,
    getSeason,
    makeTransaction,
    processVariantFiveArray,
    selectionSortDescending,
    splitMatrixNumbers,
    runTask,
    runAllTasks,
  };
})();
