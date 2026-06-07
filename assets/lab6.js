(function () {
  "use strict";

  class StudyMaterial {
    constructor(id, title, description, duration) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.duration = duration;
    }

    getSummary() {
      return `${this.title}: ${this.description}`;
    }
  }

  StudyMaterial.prototype.getMeta = function () {
    return `Орієнтовний час опрацювання: ${this.duration}.`;
  };

  const studyMaterials = [
    new StudyMaterial(
      "html",
      "HTML-конспект",
      "Матеріал пояснює семантичні теги, таблиці, списки, форми та структуру навчальної сторінки.",
      "35 хв"
    ),
    new StudyMaterial(
      "css",
      "CSS-шпаргалка",
      "Добірка прикладів селекторів, каскаду, фону, рамок, адаптивної сітки та станів елементів.",
      "40 хв"
    ),
    new StudyMaterial(
      "dom",
      "DOM-практикум",
      "Практичний блок про пошук елементів, обробники подій, об'єкт події та делегування.",
      "45 хв"
    ),
  ];

  function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  }

  function formatValue(value) {
    return JSON.stringify(value, null, 2);
  }

  function getMaterialById(id) {
    return studyMaterials.find((material) => material.id === id) || null;
  }

  function logToConsole(message) {
    console.log(message);
    const consoleBox = document.getElementById("lab6-console");
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

  function showInputValue(value) {
    const message = `SHOW ME: ${value}`;
    writeOutput("1", message);
    return message;
  }

  function maskText(value) {
    return "*".repeat(value.length);
  }

  function toggleSecretText(input, button, preview) {
    const isHidden = input.type === "password";

    if (isHidden) {
      input.type = "text";
      preview.textContent = input.value;
      button.textContent = "Приховати";
      preview.dataset.masked = "false";
      logToConsole(`Task 3: ${input.value}`);
      return input.value;
    }

    const masked = maskText(input.value);
    input.type = "password";
    preview.textContent = masked;
    button.textContent = "Розкрити";
    preview.dataset.masked = "true";
    logToConsole(`Task 3: ${masked}`);
    return masked;
  }

  function isClickInsidePlace(target, placeElement) {
    return Boolean(placeElement && (target === placeElement || placeElement.contains(target)));
  }

  function reportPlaceClick(target) {
    const placeElement = document.getElementById("place");
    const result = isClickInsidePlace(target, placeElement);
    writeOutput("5", String(result));
    return result;
  }

  function analyzeCategories(categoriesRoot) {
    const items = [...categoriesRoot.querySelectorAll(":scope > .item")];
    return {
      count: items.length,
      categories: items.map((item) => ({
        title: item.querySelector("h2, h3").textContent.trim(),
        elements: item.querySelectorAll("ul > li").length,
      })),
    };
  }

  function formatCategoriesReport(report) {
    const lines = [`Number of categories: ${report.count}`];
    report.categories.forEach((category) => {
      lines.push(`Category: ${category.title}`);
      lines.push(`Elements: ${category.elements}`);
    });
    return lines.join("\n");
  }

  function runCategoriesAnalysis() {
    const categoriesRoot = document.getElementById("categories");
    const report = analyzeCategories(categoriesRoot);
    const formatted = formatCategoriesReport(report);
    writeOutput("7", formatted);
    return report;
  }

  function collectLoginData(form) {
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value.trim();

    if (!email || !password) {
      return {
        ok: false,
        message: "All form fields must be filled in",
      };
    }

    return {
      ok: true,
      data: { email, password },
    };
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = collectLoginData(form);

    if (!result.ok) {
      alert(result.message);
      writeOutput("8", result.message);
      return result;
    }

    console.log(result.data);
    writeOutput("8", formatValue(result.data));
    form.reset();
    return result;
  }

  function changeBodyColor(bodyElement, colorElement, color = getRandomHexColor()) {
    bodyElement.style.backgroundColor = color;
    colorElement.textContent = color;
    writeOutput("9", `Background color: ${color}`);
    return color;
  }

  function destroyBoxes(container = document.getElementById("boxes")) {
    if (container) {
      container.innerHTML = "";
    }
    writeOutput("10", "Колекцію очищено.");
  }

  function createBoxes(amount, container = document.getElementById("boxes")) {
    const normalizedAmount = Number(amount);

    if (!Number.isInteger(normalizedAmount) || normalizedAmount < 1 || normalizedAmount > 100) {
      writeOutput("10", "Введіть ціле число від 1 до 100.");
      return [];
    }

    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const boxes = [];

    for (let index = 0; index < normalizedAmount; index += 1) {
      const size = 30 + index * 10;
      const box = document.createElement("div");
      box.className = "lab6-box";
      box.style.width = `${size}px`;
      box.style.height = `${size}px`;
      box.style.backgroundColor = getRandomHexColor();
      box.dataset.size = String(size);
      fragment.append(box);
      boxes.push(box);
    }

    container.append(fragment);
    writeOutput("10", `Створено ${boxes.length} блоків. Останній розмір: ${30 + (boxes.length - 1) * 10}px.`);
    return boxes;
  }

  function openMaterialModal(material) {
    const modal = document.getElementById("material-modal");
    const title = document.getElementById("modal-title");
    const description = document.getElementById("modal-description");
    const meta = document.getElementById("modal-meta");

    if (!modal || !material) {
      return;
    }

    title.textContent = material.title;
    description.textContent = material.getSummary();
    meta.textContent = material.getMeta();
    modal.hidden = false;
    modal.dataset.open = "true";
    logToConsole(`Delegation: ${material.title}`);
  }

  function closeMaterialModal() {
    const modal = document.getElementById("material-modal");
    if (modal) {
      modal.hidden = true;
      modal.dataset.open = "false";
    }
  }

  function handleMaterialDelegation(event) {
    const selected = event.target.closest("[data-material-id]");
    const list = event.currentTarget;

    if (!selected || !list.contains(selected)) {
      return;
    }

    const material = getMaterialById(selected.dataset.materialId);
    openMaterialModal(material);
  }

  function runAllTasks() {
    const consoleBox = document.getElementById("lab6-console");
    if (consoleBox) {
      consoleBox.textContent = "";
    }

    const task1Input = document.getElementById("task-1-input");
    const task3Input = document.getElementById("task-3-input");
    const task3Button = document.getElementById("toggle-secret-button");
    const task3Preview = document.getElementById("secret-preview");
    const loginForm = document.querySelector(".login-form");
    const colorElement = document.querySelector(".color");
    const boxesInput = document.getElementById("boxes-amount");

    task1Input.value = "StudyTask DOM";
    showInputValue(task1Input.value);
    task3Input.type = "text";
    task3Input.value = "client-side events";
    toggleSecretText(task3Input, task3Button, task3Preview);
    reportPlaceClick(document.getElementById("place"));
    runCategoriesAnalysis();
    loginForm.elements.email.value = "student@example.com";
    loginForm.elements.password.value = "secure-password";
    handleLoginSubmit({ preventDefault() {}, currentTarget: loginForm });
    changeBodyColor(document.body, colorElement, "#dff3ec");
    boxesInput.value = "5";
    createBoxes(Number(boxesInput.value));
    openMaterialModal(studyMaterials[2]);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const showMeButton = document.getElementById("show-me-button");
    const task1Input = document.getElementById("task-1-input");
    if (showMeButton) {
      showMeButton.addEventListener("click", () => showInputValue(task1Input.value));
    }

    const secretInput = document.getElementById("task-3-input");
    const secretButton = document.getElementById("toggle-secret-button");
    const secretPreview = document.getElementById("secret-preview");
    if (secretButton) {
      secretButton.addEventListener("click", () => toggleSecretText(secretInput, secretButton, secretPreview));
    }

    window.addEventListener("click", (event) => {
      if (document.body.contains(event.target)) {
        reportPlaceClick(event.target);
      }
    });

    const categoriesButton = document.getElementById("analyze-categories-button");
    if (categoriesButton) {
      categoriesButton.addEventListener("click", runCategoriesAnalysis);
    }

    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLoginSubmit);
    }

    const changeColorButton = document.querySelector(".change-color");
    const colorElement = document.querySelector(".color");
    if (changeColorButton) {
      changeColorButton.addEventListener("click", () => changeBodyColor(document.body, colorElement));
    }

    const boxesInput = document.getElementById("boxes-amount");
    const createButton = document.querySelector("[data-create]");
    const destroyButton = document.querySelector("[data-destroy]");
    if (createButton) {
      createButton.addEventListener("click", () => {
        createBoxes(Number(boxesInput.value));
        boxesInput.value = "";
      });
    }
    if (destroyButton) {
      destroyButton.addEventListener("click", () => destroyBoxes());
    }

    const materialsList = document.getElementById("materials-list");
    if (materialsList) {
      materialsList.addEventListener("click", handleMaterialDelegation);
    }

    const modal = document.getElementById("material-modal");
    const modalClose = document.querySelector(".modal-close");
    if (modalClose) {
      modalClose.addEventListener("click", closeMaterialModal);
    }
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeMaterialModal();
        }
      });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMaterialModal();
      }
    });

    const runAllButton = document.getElementById("run-all-lab6");
    if (runAllButton) {
      runAllButton.addEventListener("click", runAllTasks);
    }

    if (new URLSearchParams(window.location.search).get("autorun") === "1") {
      runAllTasks();
    }
  });

  window.Lab6 = {
    StudyMaterial,
    analyzeCategories,
    changeBodyColor,
    closeMaterialModal,
    collectLoginData,
    createBoxes,
    destroyBoxes,
    formatCategoriesReport,
    getMaterialById,
    getRandomHexColor,
    handleMaterialDelegation,
    handleLoginSubmit,
    isClickInsidePlace,
    maskText,
    openMaterialModal,
    reportPlaceClick,
    runAllTasks,
    runCategoriesAnalysis,
    showInputValue,
    studyMaterials,
    toggleSecretText,
  };
})();
