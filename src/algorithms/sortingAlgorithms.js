// Utility function to create delay based on speed
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Bubble Sort
export const bubbleSort = async (array, onUpdate, speed) => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;
  const delay = 101 - speed / 5;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      comparisons++;
      iterations++;

      onUpdate([j, j + 1], [], { comparisons, swaps, iterations });
      await sleep(delay);

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
      }

      onUpdate([j, j + 1], [], { comparisons, swaps, iterations });
      await sleep(delay / 2);
    }
  }

  return arr;
};

// Selection Sort
export const selectionSort = async (array, onUpdate, speed) => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;
  const delay = 101 - speed / 5;

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    iterations++;

    for (let j = i + 1; j < arr.length; j++) {
      comparisons++;
      iterations++;

      onUpdate([i, j], [], { comparisons, swaps, iterations });
      await sleep(delay);

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      swaps++;
    }

    onUpdate([i], Array.from({ length: i + 1 }, (_, idx) => idx), {
      comparisons,
      swaps,
      iterations,
    });
    await sleep(delay / 2);
  }

  return arr;
};

// Insertion Sort
export const insertionSort = async (array, onUpdate, speed) => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;
  const delay = 101 - speed / 5;

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    iterations++;

    while (j >= 0 && arr[j] > key) {
      comparisons++;
      iterations++;

      onUpdate([j, i], [], { comparisons, swaps, iterations });
      await sleep(delay);

      arr[j + 1] = arr[j];
      j--;
      swaps++;
    }

    arr[j + 1] = key;

    onUpdate([], Array.from({ length: i + 1 }, (_, idx) => idx), {
      comparisons,
      swaps,
      iterations,
    });
    await sleep(delay / 2);
  }

  return arr;
};

// Merge Sort
export const mergeSort = async (array, onUpdate, speed) => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;
  const delay = 101 - speed / 5;

  const merge = async (left, mid, right) => {
    let leftArr = arr.slice(left, mid + 1);
    let rightArr = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      iterations++;

      onUpdate([left + i, mid + 1 + j], [], { comparisons, swaps, iterations });
      await sleep(delay);

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      swaps++;
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
      swaps++;
      iterations++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
      swaps++;
      iterations++;
    }
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
export const quickSort = async (array, onUpdate, speed) => {
  let arr = [...array];
  let comparisons = 0;
  let swaps = 0;
  let iterations = 0;
  const delay = 101 - speed / 5;

  const partition = async (low, high) => {
    let pivot = arr[high];
    let i = low - 1;
    iterations++;

    for (let j = low; j < high; j++) {
      comparisons++;
      iterations++;

      onUpdate([i + 1, j], [], { comparisons, swaps, iterations });
      await sleep(delay);

      if (arr[j] < pivot) {
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
