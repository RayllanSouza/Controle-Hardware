const mysql = require('mysql2');

const connection = mysql.createPool({
    host:'localhost',
    user: 'tecnologia',
    password: 'tel*2022',
    database: 'controledehardware'
})

let SyncSQL = (sql, placeholders) => new Promise((resolve, reject) => {
    connection.query(sql, placeholders, (err, results, fields) => {
        if (err) return reject(err);
        return resolve(results);
    });
});

module.exports = {SyncSQL, connection};