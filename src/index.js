const createFps = require("fps-indicator");
const { getNthPrime } = require("./prime.js");

let startTime = 0;
let inProgress = false;

// Create worker
const worker = new Worker("./worker.js");
// Define worker response reaction
worker.onmessage = function (event) {
  // Capture the start time
  startTime = performance.now();
  const messageFromWorker = event.data;
  const duration = performance.now() - startTime;

  document.getElementById(
    "calculation-output"
  ).innerText = `${messageFromWorker.input}th prime number is ${messageFromWorker.output}.`;

  document.getElementById(
    "calculation-time"
  ).innerText = `Main thread was blocked for ${duration / 1000} seconds.`;

  finishLoading();
};

document
  .getElementById("submit-main-thread")
  .addEventListener("click", calculatePrimeMainThread);
document
  .getElementById("submit-web-worker")
  .addEventListener("click", calculatePrimeWebWorker);

let fps = createFps({ color: "hsl(230, 100%, 95%" });

// Get number from form
function getInputNumber() {
  const inputElement = document.getElementById("numberInput");
  const number = parseInt(inputElement.value, 10);
  if (!isNaN(number)) {
    return number;
  } else {
    document.getElementById("calculation-output").innerText = `Invalid input!`;
    document.getElementById("calculation-output").style.display = "block";
    document.getElementById("calculation-time").style.display = "none";
    document.getElementById("loader-ellipsis").style.display = "none";
  }
}

// Start calculation prime number in web worker
function calculatePrimeWebWorker() {
  const number = getInputNumber();
  if (number && !inProgress) {
    startLoading();
    // Send a message to the worker
    worker.postMessage(number);
  }
}

// Start calculation prime number in main thread
function calculatePrimeMainThread() {
  const number = getInputNumber();
  if (number && !inProgress) {
    startLoading();
    // Capture the start time
    const startTime = performance.now();

    // Perform the blocking operation
    document.getElementById(
      "calculation-output"
    ).innerText = `${number}th prime number is ${getNthPrime(number)}.`;

    // Calculate the duration in milliseconds
    const duration = performance.now() - startTime;
    document.getElementById(
      "calculation-time"
    ).innerText = `Main thread was blocked for ${duration / 1000} seconds.`;
    finishLoading();
  }
}

function startLoading() {
  inProgress = true;
  document.getElementById("calculation-output").style.display = "none";
  document.getElementById("calculation-time").style.display = "none";
  document.getElementById("loader-ellipsis").style.display = "block";
}

function finishLoading() {
  inProgress = false;
  document.getElementById("calculation-output").style.display = "block";
  document.getElementById("calculation-time").style.display = "block";
  document.getElementById("loader-ellipsis").style.display = "none";
}
