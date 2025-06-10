import regedit from 'regedit'



// 使用 Promise 封装 regedit.list 以便于异步处理
export function listRegistry(path) {
  return new Promise((resolve, reject) => {
    regedit.list(path, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
