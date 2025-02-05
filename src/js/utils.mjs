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
