import mysql from 'mysql2/promise';
const config = {
  name: 'currancyBackend',
  connector: 'mysql',
  url: '',
  host: '97.74.80.158',
  port: 3306,
  user: 'currencyuser',
  password: '#Yh85u50d',
  database: 'currencydb',
};
export const pool = mysql.createPool({
  host: config.host, // your mysql host
  user: config.user, // your mysql user
  password: config.password, // your mysql password
  database: config.database, // your mysql database name
  port: Number(config.port), // default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
