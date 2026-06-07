(function () {
  "use strict";

  const storageKeys = {
    cart: "studytask-lab7-cart",
    feedback: "feedback-form-state",
    pixabayKey: "studytask-pixabay-key",
  };

  const products = [
    { id: "notebook", title: "Навчальний блокнот", price: 180, category: "Організація" },
    { id: "planner", title: "Планер дедлайнів", price: 260, category: "Планування" },
    { id: "markers", title: "Набір маркерів", price: 140, category: "Канцелярія" },
    { id: "course-card", title: "Картка курсу", price: 90, category: "Матеріали" },
    { id: "flashcards", title: "Flashcards для JS", price: 210, category: "JavaScript" },
    { id: "timer", title: "Картка таймера", price: 120, category: "Асинхронність" },
    { id: "storage-guide", title: "Web Storage guide", price: 240, category: "Web API" },
    { id: "api-map", title: "REST API map", price: 300, category: "HTTP" },
  ];

  const productState = {
    page: 1,
    perPage: 4,
  };

  const cartState = {
    items: {},
  };

  const formData = {
    email: "",
    message: "",
  };

  let userSelectedDate = null;
  let timerId = null;
  let searchLightbox = null;

  function svgDataUri(title, accent, text) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="620" viewBox="0 0 960 620"><rect width="960" height="620" fill="#f7fbf9"/><rect x="52" y="52" width="856" height="516" rx="28" fill="${accent}"/><circle cx="800" cy="148" r="62" fill="#ffffff" opacity="0.28"/><path d="M120 430 C250 310 330 360 430 250 C540 130 662 300 820 178 L820 500 L120 500 Z" fill="#ffffff" opacity="0.35"/><text x="100" y="150" fill="#ffffff" font-family="Arial, sans-serif" font-size="56" font-weight="700">${title}</text><text x="100" y="220" fill="#ffffff" font-family="Arial, sans-serif" font-size="28">${text}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  const images = [
    {
      preview: svgDataUri("Storage", "#17775e", "localStorage state"),
      original: svgDataUri("Storage", "#17775e", "localStorage state"),
      description: "Дані форми у Web Storage",
    },
    {
      preview: svgDataUri("Promise", "#d66b3d", "then catch finally"),
      original: svgDataUri("Promise", "#d66b3d", "then catch finally"),
      description: "Ланцюжок промісів",
    },
    {
      preview: svgDataUri("REST API", "#24433c", "fetch JSON AJAX"),
      original: svgDataUri("REST API", "#24433c", "fetch JSON AJAX"),
      description: "HTTP-запит до REST API",
    },
    {
      preview: svgDataUri("Pagination", "#3d77e8", "page by page"),
      original: svgDataUri("Pagination", "#3d77e8", "page by page"),
      description: "Пагінація списку елементів",
    },
  ];

  const mockPixabayHits = [
    {
      id: 101,
      webformatURL: svgDataUri("Study", "#17775e", "dashboard"),
      largeImageURL: svgDataUri("Study", "#17775e", "dashboard"),
      tags: "study dashboard planning",
      likes: 42,
      views: 1200,
      comments: 9,
      downloads: 320,
    },
    {
      id: 102,
      webformatURL: svgDataUri("Code", "#24433c", "javascript"),
      largeImageURL: svgDataUri("Code", "#24433c", "javascript"),
      tags: "code javascript api",
      likes: 31,
      views: 980,
      comments: 6,
      downloads: 210,
    },
    {
      id: 103,
      webformatURL: svgDataUri("Async", "#d66b3d", "promise"),
      largeImageURL: svgDataUri("Async", "#d66b3d", "promise"),
      tags: "async promise fetch",
      likes: 28,
      views: 760,
      comments: 5,
      downloads: 170,
    },
  ];

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function notify(message, type = "info") {
    if (window.iziToast) {
      window.iziToast[type] ? window.iziToast[type]({ message, position: "topRight" }) : window.iziToast.info({ message });
    }

    const toast = document.getElementById("lab7-console");
    if (toast) {
      const timestamp = new Date().toLocaleTimeString("uk-UA", { hour12: false });
      toast.textContent += `[${timestamp}] ${message}\n`;
      toast.scrollTop = toast.scrollHeight;
    }
  }

  function writeOutput(targetId, message) {
    const target = document.getElementById(targetId);
    if (target) {
      target.textContent = message;
    }
    notify(message);
  }

  function paginateItems(items, page, perPage) {
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * perPage;
    return {
      items: items.slice(start, start + perPage),
      page: safePage,
      totalPages,
    };
  }

  function loadCart() {
    cartState.items = readJson(storageKeys.cart, {});
    return cartState.items;
  }

  function saveCart() {
    saveJson(storageKeys.cart, cartState.items);
  }

  function calculateCartTotal(items = cartState.items) {
    return Object.entries(items).reduce((total, [productId, quantity]) => {
      const product = products.find((item) => item.id === productId);
      return product ? total + product.price * quantity : total;
    }, 0);
  }

  function addToCart(productId) {
    cartState.items[productId] = (cartState.items[productId] || 0) + 1;
    saveCart();
    renderCart();
    return { ...cartState.items };
  }

  function removeFromCart(productId) {
    delete cartState.items[productId];
    saveCart();
    renderCart();
    return { ...cartState.items };
  }

  function clearCart() {
    cartState.items = {};
    saveCart();
    renderCart();
  }

  function renderProducts() {
    const productList = document.getElementById("product-list");
    const pageLabel = document.getElementById("products-page-label");
    if (!productList) {
      return;
    }

    const page = paginateItems(products, productState.page, productState.perPage);
    productState.page = page.page;
    productList.innerHTML = page.items
      .map(
        (product) => `<article class="product-card">
          <h3>${escapeHtml(product.title)}</h3>
          <p>${escapeHtml(product.category)}</p>
          <strong>${product.price} грн</strong>
          <button type="button" data-add-product="${product.id}">Додати</button>
        </article>`
      )
      .join("");
    if (pageLabel) {
      pageLabel.textContent = `${page.page} / ${page.totalPages}`;
    }
    return page;
  }

  function renderCart() {
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    if (!cartList) {
      return;
    }

    const entries = Object.entries(cartState.items);
    if (entries.length === 0) {
      cartList.innerHTML = "<p>Кошик порожній.</p>";
    } else {
      cartList.innerHTML = entries
        .map(([productId, quantity]) => {
          const product = products.find((item) => item.id === productId);
          if (!product) {
            return "";
          }
          return `<article class="cart-row">
            <span>${escapeHtml(product.title)} x ${quantity}</span>
            <strong>${product.price * quantity} грн</strong>
            <button type="button" data-remove-product="${product.id}">x</button>
          </article>`;
        })
        .join("");
    }

    if (cartTotal) {
      cartTotal.textContent = `Разом: ${calculateCartTotal()} грн`;
    }
  }

  function renderGallery() {
    const gallery = document.querySelector(".lab7-gallery");
    if (!gallery) {
      return;
    }

    gallery.innerHTML = images
      .map(
        (image) => `<li class="gallery-item">
          <a href="${image.original}">
            <img src="${image.preview}" alt="${escapeHtml(image.description)}" loading="lazy">
          </a>
          <p>${escapeHtml(image.description)}</p>
        </li>`
      )
      .join("");
  }

  function openFallbackModal(src, description) {
    const modal = document.getElementById("lab7-fallback-modal");
    const image = document.getElementById("lab7-modal-image");
    const caption = document.getElementById("lab7-modal-caption");
    if (!modal || !image || !caption) {
      return;
    }
    image.src = src;
    image.alt = description;
    caption.textContent = description;
    modal.hidden = false;
  }

  function closeFallbackModal() {
    const modal = document.getElementById("lab7-fallback-modal");
    if (modal) {
      modal.hidden = true;
    }
  }

  function openGalleryModal(src, description) {
    if (window.basicLightbox) {
      const instance = window.basicLightbox.create(`<figure class="basic-gallery-modal"><img src="${src}" alt="${escapeHtml(description)}"><figcaption>${escapeHtml(description)}</figcaption></figure>`);
      instance.show();
    } else {
      openFallbackModal(src, description);
    }
  }

  function handleGalleryClick(event) {
    const link = event.target.closest("a");
    const gallery = event.currentTarget;
    if (!link || !gallery.contains(link)) {
      return;
    }
    event.preventDefault();
    const image = link.querySelector("img");
    const original = link.href;
    const description = image ? image.alt : "Зображення";
    writeOutput("gallery-output", `original: ${original}`);
    openGalleryModal(original, description);
  }

  function syncFeedbackForm(form) {
    form.elements.email.value = formData.email;
    form.elements.message.value = formData.message;
  }

  function loadFeedbackState(form) {
    const saved = readJson(storageKeys.feedback, null);
    if (saved) {
      formData.email = saved.email || "";
      formData.message = saved.message || "";
    }
    syncFeedbackForm(form);
    return { ...formData };
  }

  function handleFeedbackInput(event) {
    const field = event.target;
    if (!Object.prototype.hasOwnProperty.call(formData, field.name)) {
      return;
    }
    formData[field.name] = field.value.trim();
    saveJson(storageKeys.feedback, formData);
  }

  function submitFeedback(form) {
    if (!formData.email || !formData.message) {
      alert("Fill please all fields");
      writeOutput("feedback-output", "Fill please all fields");
      return { ok: false, data: { ...formData } };
    }

    const submitted = { ...formData };
    console.log(submitted);
    localStorage.removeItem(storageKeys.feedback);
    formData.email = "";
    formData.message = "";
    form.reset();
    writeOutput("feedback-output", JSON.stringify(submitted, null, 2));
    return { ok: true, data: submitted };
  }

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return { days, hours, minutes, seconds };
  }

  function addLeadingZero(value) {
    return String(value).padStart(2, "0");
  }

  function renderTimerValues(values) {
    const selectors = {
      days: "[data-days]",
      hours: "[data-hours]",
      minutes: "[data-minutes]",
      seconds: "[data-seconds]",
    };
    Object.entries(selectors).forEach(([key, selector]) => {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = key === "days" ? String(values[key]).padStart(2, "0") : addLeadingZero(values[key]);
      }
    });
  }

  function validateTimerDate(date) {
    const startButton = document.querySelector("[data-start]");
    if (!(date instanceof Date) || Number.isNaN(date.getTime()) || date <= new Date()) {
      userSelectedDate = null;
      if (startButton) {
        startButton.disabled = true;
      }
      notify("Please choose a date in the future", "error");
      return false;
    }

    userSelectedDate = date;
    if (startButton) {
      startButton.disabled = false;
    }
    writeOutput("timer-output", `Обрано майбутню дату: ${date.toLocaleString("uk-UA")}`);
    return true;
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    const input = document.getElementById("datetime-picker");
    const button = document.querySelector("[data-start]");
    if (input) {
      input.disabled = false;
    }
    if (button) {
      button.disabled = true;
    }
  }

  function startTimer() {
    if (!userSelectedDate) {
      return false;
    }

    const input = document.getElementById("datetime-picker");
    const button = document.querySelector("[data-start]");
    if (input) {
      input.disabled = true;
    }
    if (button) {
      button.disabled = true;
    }

    const tick = () => {
      const diff = userSelectedDate - new Date();
      if (diff <= 0) {
        renderTimerValues({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        writeOutput("timer-output", "Таймер завершено: 00:00:00:00");
        stopTimer();
        return;
      }
      const values = convertMs(diff);
      renderTimerValues(values);
      writeOutput("timer-output", `Залишилось: ${values.days}:${addLeadingZero(values.hours)}:${addLeadingZero(values.minutes)}:${addLeadingZero(values.seconds)}`);
    };

    tick();
    timerId = setInterval(tick, 1000);
    return true;
  }

  function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === "fulfilled") {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });
  }

  function handlePromiseSubmit(form) {
    const delay = Number(form.elements.delay.value);
    const state = form.elements.state.value;
    return createPromise(delay, state)
      .then((value) => {
        const message = `Fulfilled promise in ${value}ms`;
        writeOutput("promise-output", message);
        notify(message, "success");
        return message;
      })
      .catch((value) => {
        const message = `Rejected promise in ${value}ms`;
        writeOutput("promise-output", message);
        notify(message, "error");
        return message;
      })
      .finally(() => {
        notify("Promise settled");
      });
  }

  function buildPixabayUrl({ query, apiKey, page = 1, perPage = 12 }) {
    const params = new URLSearchParams({
      key: apiKey,
      q: query,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: "true",
      page: String(page),
      per_page: String(perPage),
    });
    return `https://pixabay.com/api/?${params.toString()}`;
  }

  function fetchPixabayImages({ query, apiKey, page = 1, perPage = 12, fetcher = fetch }) {
    if (!query.trim()) {
      return Promise.reject(new Error("Search query is empty"));
    }

    if (!apiKey.trim()) {
      const normalized = query.trim().toLowerCase();
      const hits = mockPixabayHits.filter((hit) => hit.tags.toLowerCase().includes(normalized) || normalized === "study");
      return new Promise((resolve) => {
        setTimeout(() => resolve({ hits, totalHits: hits.length, synthetic: true }), 120);
      });
    }

    return fetcher(buildPixabayUrl({ query, apiKey, page, perPage }))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Pixabay HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => ({ ...data, synthetic: false }));
  }

  function renderImageResults(hits) {
    const results = document.querySelector(".image-results");
    if (!results) {
      return;
    }

    results.innerHTML = hits
      .map(
        (hit) => `<li class="image-card">
          <a href="${hit.largeImageURL}">
            <img src="${hit.webformatURL}" alt="${escapeHtml(hit.tags)}" loading="lazy">
          </a>
          <dl>
            <div><dt>Likes</dt><dd>${hit.likes}</dd></div>
            <div><dt>Views</dt><dd>${hit.views}</dd></div>
            <div><dt>Comments</dt><dd>${hit.comments}</dd></div>
            <div><dt>Downloads</dt><dd>${hit.downloads}</dd></div>
          </dl>
        </li>`
      )
      .join("");

    if (searchLightbox && typeof searchLightbox.refresh === "function") {
      searchLightbox.refresh();
    }
  }

  function setLoader(isVisible) {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.hidden = !isVisible;
    }
  }

  function handleSearchSubmit(form) {
    const query = form.elements.query.value.trim();
    const apiKey = form.elements.apiKey.value.trim();
    const meta = document.getElementById("search-meta");

    if (!query) {
      notify("Search query is empty", "error");
      return Promise.resolve({ ok: false, reason: "empty-query" });
    }

    if (apiKey) {
      localStorage.setItem(storageKeys.pixabayKey, apiKey);
    }

    const results = document.querySelector(".image-results");
    if (results) {
      results.innerHTML = "";
    }
    setLoader(true);

    return fetchPixabayImages({ query, apiKey })
      .then((data) => {
        if (!data.hits || data.hits.length === 0) {
          const message = "Sorry, there are no images matching your search query. Please try again!";
          notify(message, "error");
          if (meta) {
            meta.textContent = message;
          }
          return { ok: false, data };
        }
        renderImageResults(data.hits);
        if (meta) {
          meta.textContent = data.synthetic
            ? `Демо-результати: ${data.hits.length}`
            : `Pixabay results: ${data.hits.length} із ${data.totalHits}`;
        }
        return { ok: true, data };
      })
      .catch((error) => {
        const message = error.message || "Image search failed";
        notify(message, "error");
        if (meta) {
          meta.textContent = message;
        }
        return { ok: false, error: message };
      })
      .finally(() => {
        setLoader(false);
      });
  }

  async function runAllTasks() {
    const consoleBox = document.getElementById("lab7-console");
    if (consoleBox) {
      consoleBox.textContent = "";
    }

    clearCart();
    addToCart("notebook");
    addToCart("planner");
    productState.page = 2;
    renderProducts();

    const galleryLink = document.querySelector(".lab7-gallery a");
    if (galleryLink) {
      writeOutput("gallery-output", `original: ${galleryLink.href}`);
    }

    const form = document.querySelector(".feedback-form");
    form.elements.email.value = "student@example.com";
    form.elements.message.value = "ЛР 7: Web Storage працює";
    handleFeedbackInput({ target: form.elements.email });
    handleFeedbackInput({ target: form.elements.message });
    submitFeedback(form);

    const futureDate = new Date(Date.now() + 65000);
    const timerInput = document.getElementById("datetime-picker");
    timerInput.value = futureDate.toISOString().slice(0, 16).replace("T", " ");
    validateTimerDate(futureDate);
    renderTimerValues(convertMs(futureDate - new Date()));

    const promiseForm = document.querySelector(".promise-form");
    promiseForm.elements.delay.value = "20";
    promiseForm.elements.state.value = "fulfilled";
    await handlePromiseSubmit(promiseForm);

    const searchForm = document.querySelector(".search-form");
    searchForm.elements.query.value = "study";
    await handleSearchSubmit(searchForm);
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    renderProducts();
    renderCart();
    renderGallery();

    const productList = document.getElementById("product-list");
    if (productList) {
      productList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-add-product]");
        if (button) {
          addToCart(button.dataset.addProduct);
        }
      });
    }

    const cartList = document.getElementById("cart-list");
    if (cartList) {
      cartList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-remove-product]");
        if (button) {
          removeFromCart(button.dataset.removeProduct);
        }
      });
    }

    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {
      clearCartButton.addEventListener("click", clearCart);
    }

    const prevButton = document.querySelector("[data-products-prev]");
    const nextButton = document.querySelector("[data-products-next]");
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        productState.page -= 1;
        renderProducts();
      });
    }
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        productState.page += 1;
        renderProducts();
      });
    }

    const gallery = document.querySelector(".lab7-gallery");
    if (gallery) {
      gallery.addEventListener("click", handleGalleryClick);
    }

    const feedbackForm = document.querySelector(".feedback-form");
    if (feedbackForm) {
      loadFeedbackState(feedbackForm);
      feedbackForm.addEventListener("input", handleFeedbackInput);
      feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitFeedback(feedbackForm);
      });
    }

    const timerInput = document.getElementById("datetime-picker");
    if (window.flatpickr && timerInput) {
      window.flatpickr(timerInput, {
        enableTime: true,
        time_24hr: true,
        defaultDate: new Date(),
        minuteIncrement: 1,
        onClose(selectedDates) {
          validateTimerDate(selectedDates[0]);
        },
      });
    } else if (timerInput) {
      timerInput.addEventListener("change", () => validateTimerDate(new Date(timerInput.value)));
    }

    const startButton = document.querySelector("[data-start]");
    if (startButton) {
      startButton.addEventListener("click", startTimer);
    }

    const promiseForm = document.querySelector(".promise-form");
    if (promiseForm) {
      promiseForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handlePromiseSubmit(promiseForm);
      });
    }

    const searchForm = document.querySelector(".search-form");
    if (searchForm) {
      searchForm.elements.apiKey.value = localStorage.getItem(storageKeys.pixabayKey) || "";
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handleSearchSubmit(searchForm);
      });
    }

    if (window.SimpleLightbox) {
      searchLightbox = new window.SimpleLightbox(".image-results a", { captionsData: "alt", captionDelay: 200 });
    }

    const fallbackModal = document.getElementById("lab7-fallback-modal");
    const fallbackClose = fallbackModal ? fallbackModal.querySelector(".modal-close") : null;
    if (fallbackClose) {
      fallbackClose.addEventListener("click", closeFallbackModal);
    }
    if (fallbackModal) {
      fallbackModal.addEventListener("click", (event) => {
        if (event.target === fallbackModal) {
          closeFallbackModal();
        }
      });
    }

    const runAllButton = document.getElementById("run-all-lab7");
    if (runAllButton) {
      runAllButton.addEventListener("click", () => {
        runAllTasks();
      });
    }

    if (new URLSearchParams(window.location.search).get("autorun") === "1") {
      runAllTasks();
    }
  });

  window.Lab7 = {
    addLeadingZero,
    addToCart,
    buildPixabayUrl,
    calculateCartTotal,
    clearCart,
    closeFallbackModal,
    convertMs,
    createPromise,
    fetchPixabayImages,
    formData,
    handleFeedbackInput,
    handleGalleryClick,
    handlePromiseSubmit,
    handleSearchSubmit,
    images,
    loadFeedbackState,
    mockPixabayHits,
    paginateItems,
    products,
    removeFromCart,
    renderCart,
    renderGallery,
    renderImageResults,
    renderProducts,
    runAllTasks,
    storageKeys,
    submitFeedback,
    validateTimerDate,
  };
})();
