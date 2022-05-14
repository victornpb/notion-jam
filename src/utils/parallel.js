export default function parallel(items, handler, concurrency) {
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error('concurrency must be a positive integer greater than 0');

  return new Promise((resolve, reject) => {
    const results = [];
    let i = 0;

    const next = (result) => {
      results.push(result);
      if (i < items.length) {
        handler(items[i++]).then(next).catch(reject);
      }
      else if (results.length === items.length) resolve(results);
    };

    for (let x = 0; x < Math.min(concurrency, items.length); x++) {
      handler(items[i++]).then(next).catch(reject);
    }
  });
}
