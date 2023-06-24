const { getNthPrime } = require("./prime.js");

self.onmessage = function (event) {
  const messageFromMain = event.data;

  // Perform some calculations or processing
  const result = getNthPrime(messageFromMain);

  // Send the result back to the main thread
  self.postMessage({input: event.data, output: result});
};
