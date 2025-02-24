// utils.mjs

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  // let existingCart = JSON.parse(localStorage.getItem(key)) || [];
  // if (!Array.isArray(existingCart)) {
  //   existingCart = [];
  // }
  // existingCart.push(data);
  // localStorage.setItem(key, JSON.stringify(existingCart));
}

// clear data from local storage
export function clearLocalStorage(key) {
  localStorage.removeItem(key);
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// create getParam function which will retrieve URL parameters
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// General reusable list renderer
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = true) {
  if (clear) {
    parentElement.innerHTML = ""; // Clear the parent element
  }
  const htmlStrings = list.map(templateFn); // Generate HTML for each item using the template function
  parentElement.insertAdjacentHTML(position, htmlStrings.join("")); // Insert the HTML into the DOM
}

export function renderWithTemplate(template, parentElement, list, position = "afterbegin", clear = true) {
  if (clear) {
    parentElement.innerHTML = ""; // Clear the parent element
  }
  parentElement.insertAdjacentHTML(position, template);
}

async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.statusText}`);

    const text = await res.text();
    if (!text.trim()) throw new Error(`${path} is empty.`);

    return text;
  } catch (error) {
    console.error("Fetch error:", error);
    return "";
  }
}

export async function loadHeaderFooter() {
  const headerHTML = await loadTemplate("/partials/header.html");
  const footerHTML = await loadTemplate("/partials/footer.html");

  console.log("Header HTML:", headerHTML); // Debugging
  console.log("Footer HTML:", footerHTML); // Debugging

  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  if (header && headerHTML.trim()) {
    header.innerHTML = headerHTML;
  } else {
    console.error("Header not found in DOM or is empty.");
  }

  if (footer && footerHTML.trim()) {
    footer.innerHTML = footerHTML;
  } else {
    console.error("Footer not found in DOM or is empty.");
  }
}

// Custom alert message function for non-intrusive notifications
export function alertMessage(message, scroll = true) {
  // Create element to hold the alert
  const alert = document.createElement("div");
  alert.classList.add("alert");

  // Set the contents (message and close button)
  alert.innerHTML = `
    <span>${message}</span>
    <button class="close-alert">×</button>
  `;

  // Add event listener to close the alert when X is clicked
  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("close-alert")) {
      alert.remove();
    }
  });

  // Add the alert to the top of the main element
  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  // Scroll to the top if needed
  if (scroll) {
    window.scrollTo(0, 0);
  }
}
