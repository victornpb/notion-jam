export default function parallel(items, handler, concurrency) {
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error('concurrency must be a positive integer greater than 0');
  if (items.length === 0) return Promise.resolve([]);
  return new Promise((jobResolve, jobReject) => {
    const results = [];
    let i = 0;

    const resolve = (result) => {
      results.push(result);
      next();
    };
    const reject = (err) => {
      jobReject(err);
    };

    const next = () => {
      if (i < items.length) {
        try {
          handler(items[i++]).then(resolve).catch(reject);
        } catch (err) { reject(err); }
      }
      else if (results.length === items.length) jobResolve(results);
    };

    for (let x = 0; x < Math.min(concurrency, items.length); x++) {
      try {
        handler(items[i++]).then(next).catch(reject);
      } catch (err) { reject(err); break; }
    }
  });
}
