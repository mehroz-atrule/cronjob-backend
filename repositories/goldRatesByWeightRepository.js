import {pool} from '../config/db.js';

export const goldRatesByWeightRepository = {
  async deleteAll() {
    console.log('Deleting all from goldratesbyweight and goldweightdata');
    await pool.query('DELETE FROM goldweightdata');
    await pool.query('DELETE FROM goldratesbyweight');
  },

  async create(data) {
    if (!data?.date || !Array.isArray(data.rates)) return;

    // Insert main record with date, get inserted id
    await pool.query(
      `INSERT INTO goldratesbyweight (date,rates) VALUES (?, ?)`,
      [data.date, JSON.stringify(data.rates)],
    );

    // Insert each gold weight data linked to above record
    for (const item of data.rates) {
      await pool.query(
        `INSERT INTO goldweightdata ( Goldweight, Karat_24, Karat_22, Karat_21, Karat_18, Karat_12) VALUES ( ?, ?, ?, ?, ?, ?)`,
        [
          item.GoldWeight,
          item.Karat_24,
          item.Karat_22,
          item.Karat_21,
          item.Karat_18,
          item.Karat_12,
        ],
      );
    }
  },
};
