
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 
 * @param A string字符串 
 * @return int整型
 */
function getLongestPalindrome( A ) {
  // write code here
  let max = 0
  let count = 0
  for (let i = 0; i < A.length; i++) {
    let l = i
    let r = A.length - 1
    while(l <= r) {
      if (A[l] === A[r]) {
        count++
        l++
        r--
      } else if (A[l] !== A[r] && !count) {
        r--
      } else if (A[l] !== A[r] && count > 0) {
        count = 0
        l = i
      }
    }
    count = count * 2
    if (count > 0 && l - r === 2) {
      count--
    }
    max = Math.max(max, count)
    count = 0
  }
  return max
}
console.log(getLongestPalindrome('babcaaccabab'))
module.exports = {
  getLongestPalindrome : getLongestPalindrome
};
