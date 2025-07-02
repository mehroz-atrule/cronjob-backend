import puppeteer from 'puppeteer';

const url = 'https://gold.pk/pakistan-gold-rates-xaup.php';
export const fetchDataGoldOldDays = async () => {
  let browser = null;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitForSelector('.progress-table', {timeout: 10000});

    const tableData = await page.evaluate(() => {
      const table = document.querySelector('.progress-table');
      if (!table) {
        return [];
      }

      const rows = table.querySelectorAll('.table-row');
      const data = [];

      rows.forEach(row => {
        const columns = row.querySelectorAll('.column15');
        if (columns.length === 6) {
          const Dates = columns[0].textContent.trim();
          const Gold10Grams = columns[1].textContent.trim();
          const GoldPerTola = columns[2].textContent.trim();
          const Gold24KaratPerGram = columns[3].textContent.trim();
          const Gold22KaratPerGram = columns[4].textContent.trim();
          const Gold21KaratPerGram = columns[5].textContent.trim();

          data.push({
            Date: Dates,
            Gold10Grams,
            GoldPerTola,
            Gold24KaratPerGram,
            Gold22KaratPerGram,
            Gold21KaratPerGram,
          });
        }
      });

      return data;
    });
    await page.close();

    const last15DaysGoldData = {
      rates: tableData,
    };
    return last15DaysGoldData;
  } catch (error) {
    console.error(error);
    return undefined;
  } finally {
    // Always attempt to close browser
    if (browser) {
      await browser.close();
    }
  }
};
