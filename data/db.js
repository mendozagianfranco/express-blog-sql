const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_blog'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connessione con il database avvenuta');
});

module.exports = connection;