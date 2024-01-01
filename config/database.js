const mysql =  require('mysql2');
// const {Connector} = require('@google-cloud/cloud-sql-connector');
require('dotenv').config();

const dbpool = mysql.createPool({
    
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    // instanceConnectionName: 'explorin-406714:asia-southeast2:explorinsql',
    // host: '127.0.0.1',
    // user: root1,
    // password: null,
    // database: explorindb,

    // host: '127.0.0.1',
    // user: root,
    // password: 12345,
    // database: explorindb,

    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0,

    // retry: {
    //     match: [/Deadlock/i],
    //     max: 3, // Maximum rety 3 times
    //     backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
    //     backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
    //   }
});

module.exports = dbpool.promise();