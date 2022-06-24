
//to generate n random integers in the range provided, start and stop both inclusive
function random(n,start,stop){
    let random_set = new Set();
    while(random_set.size < n){
      random_set.add(start + Math.floor(Math.random() * (stop - start + 1)));
    }
    return [...random_set];
}

export {random};