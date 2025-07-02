import {pool} from '../config/db.js';

export const pastDaysGoldRatesRepository = {
  async deleteAll() {
    console.log('Deleting all from goldpastrates');
    await pool.query('DELETE FROM goldpastrates');
    await pool.query('DELETE FROM goldpastdata');
  },

  async create(data) {
    if (!Array.isArray(data.rates)) return;

    await pool.query(`INSERT INTO goldpastrates (rates) VALUES ( ?)`, [
      JSON.stringify(data.rates),
    ]);
    for (const item of data.rates) {
      await pool.query(
        `INSERT INTO goldpastdata 
          (Date, Gold10grams, GoldPerTola, Gold24KaratPerGram, Gold22KaratPerGram, Gold21KaratPerGram)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.Date,
          item.Gold10Grams,
          item.GoldPerTola,
          item.Gold24KaratPerGram,
          item.Gold22KaratPerGram,
          item.Gold21KaratPerGram,
        ],
      );
    }
  },
};
