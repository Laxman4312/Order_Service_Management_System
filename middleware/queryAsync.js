const pool = require('../config/db');

function queryAsync(sql, values) {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.log("while inserting", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = queryAsync;
