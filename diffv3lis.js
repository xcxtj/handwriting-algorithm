function lis(nums) {
  let len = nums.length,
    dp = new Array(len).fill(1), //记录长度
    prev = new Array(len).fill(-1); // 新增prev数组记录每个位置的前驱索引
  let end = 0; // 记录最长递增子序列的结束位置索引
  for (let i = 0; i < len; ++i) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j] && dp[j] + 1 > dp[i]) {
        //比较dp
        dp[i] = dp[j] + 1;
        prev[i] = j; // 记录来源索引
      }
    }
    // 更新最长递增子序列的结束位置索引
    if (dp[i] > dp[end]) {
      end = i;
    }
  }
  //求长度，返回dp中的max
  // 根据prev数组回溯构建最长递增子序列
  let lis = [],
    cur = end;
  while (cur !== -1) {
    lis.push(cur);
    cur = prev[cur];
  }
  // 反转lis数组，因为是倒序添加的
  lis.reverse();
  return lis;
}

// 示例调用
let nums = [10, 9, 2, 5, 3, 7, 101, 18];
console.log(lis(nums)); // 输出最长递增子序列
