const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const sleepPauseable = async (ms, isPausedRef) => {
  await sleep(ms);
  while (isPausedRef && isPausedRef.current) {
    await sleep(50);
  }
};

// order: 'asc' | 'desc'
const shouldSwap = (a, b, order) => order === 'asc' ? a > b : a < b;

// Bubble Sort
export const bubbleSort = async (array, onUpdate, delay, isPausedRef, order = 'asc') => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;

  for (let i = 0; i < arr.length; i++) {
    let swappedThisPass = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      comparisons++;
      iterations++;

      onUpdate([j, j + 1], [], { comparisons, swaps, iterations }, arr);
      await sleepPauseable(delay, isPausedRef);

      if (shouldSwap(arr[j], arr[j + 1], order)) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swappedThisPass = true;
      }

      onUpdate([j, j + 1], [], { comparisons, swaps, iterations }, arr);
      await sleepPauseable(delay / 2, isPausedRef);
    }
    if (!swappedThisPass) break;
  }

  return arr;
};

// Selection Sort
export const selectionSort = async (array, onUpdate, delay, isPausedRef, order = 'asc') => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;

  for (let i = 0; i < arr.length; i++) {
    let targetIndex = i;
    iterations++;

    for (let j = i + 1; j < arr.length; j++) {
      comparisons++;
      iterations++;

      onUpdate([i, j], [], { comparisons, swaps, iterations }, arr);
      await sleepPauseable(delay, isPausedRef);

      if (shouldSwap(arr[targetIndex], arr[j], order)) {
        targetIndex = j;
      }
    }

    if (targetIndex !== i) {
      [arr[i], arr[targetIndex]] = [arr[targetIndex], arr[i]];
      swaps++;
    }

    onUpdate([i], Array.from({ length: i + 1 }, (_, idx) => idx), {
      comparisons, swaps, iterations,
    }, arr);
    await sleepPauseable(delay / 2, isPausedRef);
  }

  return arr;
};

// Insertion Sort
export const insertionSort = async (array, onUpdate, delay, isPausedRef, order = 'asc') => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    iterations++;

    while (j >= 0 && shouldSwap(arr[j], key, order)) {
      comparisons++;
      iterations++;

      onUpdate([j, i], [], { comparisons, swaps, iterations }, arr);
      await sleepPauseable(delay, isPausedRef);

      arr[j + 1] = arr[j];
      j--;
      swaps++;
    }

    arr[j + 1] = key;

    onUpdate([], Array.from({ length: i + 1 }, (_, idx) => idx), {
      comparisons, swaps, iterations,
    }, arr);
    await sleepPauseable(delay / 2, isPausedRef);
  }

  return arr;
};

// Merge Sort
export const mergeSort = async (array, onUpdate, delay, isPausedRef, order = 'asc') => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;

  const merge = async (left, mid, right) => {
    let leftArr = arr.slice(left, mid + 1);
    let rightArr = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      iterations++;

      onUpdate([left + i, mid + 1 + j], [], { comparisons, swaps, iterations }, arr);
      await sleepPauseable(delay, isPausedRef);

      if (!shouldSwap(leftArr[i], rightArr[j], order)) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      swaps++;
      k++;
    }

    while (i < leftArr.length) { arr[k++] = leftArr[i++]; swaps++; iterations++; }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; swaps++; iterations++; }
  };

  const mergeSortHelper = async (left, right) => {
    if (left < right) {
      let mid = Math.floor((left + right) / 2);
      await mergeSortHelper(left, mid);
      await mergeSortHelper(mid + 1, right);
      await merge(left, mid, right);
    }
  };

  await mergeSortHelper(0, arr.length - 1);
  return arr;
};

// Quick Sort
export const quickSort = async (array, onUpdate, delay, isPausedRef, order = 'asc') => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;

  const partition = async (low, high) => {
    let pivot = arr[high];
    let i = low - 1;
    iterations++;

    for (let j = low; j < high; j++) {
      comparisons++;
      iterations++;

      onUpdate([i + 1, j], [], { comparisons, swaps, iterations }, arr);
      await sleepPauseable(delay, isPausedRef);

      if (!shouldSwap(arr[j], pivot, order)) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;

    return i + 1;
  };

  const quickSortHelper = async (low, high) => {
    if (low < high) {
      let pi = await partition(low, high);
      await quickSortHelper(low, pi - 1);
      await quickSortHelper(pi + 1, high);
    }
  };

  await quickSortHelper(0, arr.length - 1);
  return arr;
};

export const sortingAlgorithms = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};
