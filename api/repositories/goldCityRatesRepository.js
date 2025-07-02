// repositories/goldCityRatesRepository.ts
import {pool} from '../config/db.js';

export const goldCityRatesRepository = {
  async deleteAll() {
    console.log('Deleting all from goldcitydata and goldcityrates');
    await pool.query('DELETE FROM goldcitydata');
    await pool.query('DELETE FROM goldcityrates');
  },

  async create(data) {
    if (!data?.date || !Array.isArray(data.rates)) return;

    // Insert main record with date, get inserted id
    await pool.query(`INSERT INTO goldcityrates (date,rates) VALUES (?, ?)`, [
      data.date,
      JSON.stringify(data.rates),
    ]);

    // Insert each city data linked to above record
    for (const item of data.rates) {
      // Assuming Bidding and Asking are numbers, not arrays
      await pool.query(
        `INSERT INTO goldcitydata ( CityName, Symbol, Bidding, Asking) VALUES (?, ?, ?, ?)`,
        [item.CityName, item.Symbol, item.Bidding, item.Asking],
      );
    }
  },
};
