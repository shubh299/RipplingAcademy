//to generate n random integers in the range provided, start and stop both inclusive
function random(n, start, stop) {
  let random_set = new Set();
  while (random_set.size < n) {
    random_set.add(start + Math.floor(Math.random() * (stop - start + 1)));
  }
  return [...random_set];
}

function generateInitialGrid() {
  let random_places = random(2, 0, 15);
  let temp_grid = new Array(16);
  for (let i = 0; i < random_places.length; i++) {
    temp_grid[random_places[i]] = 2;
  }
  return temp_grid;
}

export { random, generateInitialGrid };
