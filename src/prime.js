function isPrime(num) {
  if (num <= 1) {
    return false;
  }

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

exports.getNthPrime = function (n) {
  let count = 0;
  let number = 2;

  while (count < n) {
    if (isPrime(number)) {
      count++;
      if (count === n) {
        return number;
      }
    }
    number++;
  }
};
