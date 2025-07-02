import puppeteer from 'puppeteer';

const url = 'https://www.forex.pk/open_market_rates.asp/';

export const fetchData = async () => {
  let browser = null;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    const date = await page.evaluate(() => {
      const dateElement = document.querySelector('p.normaltext span.bluetext');
      if (dateElement) {
        const datePattern = /(\w{3}, [A-Z][a-z]{2} \d{1,2} \d{4})/;
        const finalDate = dateElement.nextSibling.textContent
          .trim()
          .match(datePattern);
        if (finalDate && finalDate.length > 0) {
          return finalDate[0];
        }
      }
    });

    await page.waitForSelector('table');
    const currencyData = await page.evaluate(() => {
      const currencyData = [];
      const table = document.querySelectorAll('table')[1];

      if (table) {
        const rows = table.querySelectorAll('tr:not(:first-child)');

        rows.forEach(row => {
          const columns = row.querySelectorAll('td');
          if (columns.length >= 4) {
            const currency =
              columns[0].querySelector('img')?.nextSibling.textContent.trim() ||
              '';
            const symbol =
              columns[1].querySelector('a')?.textContent.trim() || '';
            const buying = parseFloat(columns[2].textContent.trim()) || 0;
            const selling = parseFloat(columns[3].textContent.trim()) || 0;

            if (
              symbol !== 'USD-DD' &&
              symbol !== 'USD-TT' &&
              symbol !== 'Symbol' &&
              symbol !== ''
            ) {
              const currencyObj = {
                Currency: currency,
                Symbol: symbol,
                Buying: buying,
                Selling: selling,
              };
              currencyData.push(currencyObj);
            }
          }
        });
      }
      return currencyData;
    });
    await page.close();
    const currencyApiObject = {
      date: date,
      rates: currencyData,
    };
    return currencyApiObject;
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
