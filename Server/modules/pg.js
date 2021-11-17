const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ext',
  password: 'postgres',
  port: 5432,
})


exports.query = function query(q,callback) {
        pool.query( q, (err, res) => {
      
        callback(res)
         });
        }
