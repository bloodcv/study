export const printF = (str) => {
  new Promise(resolve => {
    setTimeout(() => {
      resolve("promise resolve")
    }, 1000);
  }).then(res => {
    console.log(res);
  });
  console.log('===utils=9==', str)
}