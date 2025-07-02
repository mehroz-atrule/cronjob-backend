import {pool} from '../config/db.js';

export const currencyRatesRepository = {
  async deleteAll() {
    console.log('Deleting all from currencydata and currencyrates');
    await pool.query('DELETE FROM currencydata');
    await pool.query('DELETE FROM currencyrates');
  },

  async create(data) {
    if (!data?.date || !data?.rates) return;

    // Insert the date and rates JSON as text into currencyrates table
    // Because in your dump, `currencyrates` has (id, date, rates text)
    await pool.query(`INSERT INTO currencyrates (date, rates) VALUES (?, ?)`, [
      data.date,
      JSON.stringify(data.rates),
    ]);

    // If you want to insert individual rows into currencydata, you need to add those columns and manage IDs accordingly
    await pool.query(
      `INSERT INTO currencydata (currency,Symbol, Buying,Selling) VALUES ?`,
      [
        data.rates.map(rate => [
          rate.Currency,
          rate.Symbol,
          rate.Buying,
          rate.Selling,
        ]),
      ],
    );
  },
};
