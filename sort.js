function bubble(arr) {
  for (let i = 0; i < arr.length; i++) {
    let flag = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        flag = true;
      }
    }
    if (!flag) break;
  }
  return arr;
}

function partition(l, r, arr) {
  if (l > r) return;
  //优化
  // let rand = Math.floor(Math.random() * (r - l + 1) + l);
  // [arr[l], arr[rand]] = [arr[rand], arr[l]]; // 交换l和rand位置的元素
  let pivot = arr[l];
  let [i, j] = [l, r];
  while (i < j) {
    while (i < j && arr[j] >= pivot) j--;
    while (i < j && arr[i] <= pivot) i++;
    if (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i], arr[l]] = [arr[l], arr[i]]; // 将pivot放到正确的位置
  partition(l, i - 1, arr);
  partition(i + 1, r, arr);
}
function qsort(arr) {
  partition(0, arr.length - 1, arr);
  return arr;
}
//简单版 结果arr=qsort(arr)
function qsort(arr) {
  if (arr.length <= 1) return arr;
  let left = [],
    right = [],
    pivot = arr[0]; //也可以优化
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...qsort(left), pivot, ...qsort(right)];
}
